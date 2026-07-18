import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { User } from '../users/entities/user.entity';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';
import { Doador } from './entities/doador.entity';

@Injectable()
export class DoadoresService {
  constructor(
    @InjectRepository(Doador)
    private readonly doadoresRepository: Repository<Doador>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createDoadorDto: CreateDoadorDto): Promise<Doador> {
    const user = await this.usersRepository.findOne({
      where: { id: createDoadorDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Usuário #${createDoadorDto.userId} não encontrado`,
      );
    }

    const existingDoador = await this.doadoresRepository.findOne({
      where: { userId: createDoadorDto.userId },
    });
    if (existingDoador) {
      throw new ConflictException('Este usuário já possui um perfil de doador');
    }

    const doador = this.doadoresRepository.create(createDoadorDto);
    return this.saveOrThrowConflict(doador);
  }

  findAll(): Promise<Doador[]> {
    return this.doadoresRepository.find();
  }

  async findOne(id: string): Promise<Doador> {
    const doador = await this.doadoresRepository.findOne({ where: { id } });
    if (!doador) {
      throw new NotFoundException(`Doador #${id} não encontrado`);
    }
    return doador;
  }

  async update(id: string, updateDoadorDto: UpdateDoadorDto): Promise<Doador> {
    const doador = await this.findOne(id);

    Object.assign(doador, updateDoadorDto);

    return this.saveOrThrowConflict(doador);
  }

  async remove(id: string): Promise<void> {
    const doador = await this.findOne(id);
    await this.doadoresRepository.remove(doador);
  }

  private async saveOrThrowConflict(doador: Doador): Promise<Doador> {
    try {
      return await this.doadoresRepository.save(doador);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code ===
          PostgresErrorCode.UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          'Já existe um doador com este CPF, CNPJ ou usuário vinculado',
        );
      }
      throw error;
    }
  }
}
