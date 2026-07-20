import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Já existe um usuário com este email');
    }

    const { password, ...rest } = createUserDto;

    const user = this.usersRepository.create({
      ...rest,
      passwordHash: password ? await bcrypt.hash(password, 10) : undefined,
    });

    return this.saveOrThrowConflict(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário #${id} não encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Já existe um usuário com este email');
      }
    }

    const { password, ...rest } = updateUserDto;

    Object.assign(user, rest);
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    return this.saveOrThrowConflict(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  private saveOrThrowConflict(user: User): Promise<User> {
    return saveOrMapPostgresError(() => this.usersRepository.save(user), {
      [PostgresErrorCode.UNIQUE_VIOLATION]: () => {
        throw new ConflictException('Já existe um usuário com este email');
      },
    });
  }
}
