import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from 'src/shared/database/save-or-map-postgres-error';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAdotanteDto } from './dto/create-adotante.dto';
import { UpdateAdotanteDto } from './dto/update-adotante.dto';
import { Adotante } from './entities/adotante.entity';

@Injectable()
export class AdotantesService {
  constructor(
    @InjectRepository(Adotante)
    private readonly adotantesRepository: Repository<Adotante>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createAdotanteDto: CreateAdotanteDto): Promise<Adotante> {
    const user = await this.usersRepository.findOne({
      where: { id: createAdotanteDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Usuário #${createAdotanteDto.userId} não encontrado`,
      );
    }
    const existingAdotante = await this.adotantesRepository.findOne({
      where: { userId: createAdotanteDto.userId },
    });
    if (existingAdotante) {
      throw new ConflictException(
        'Este usuário já possui um perfil de adotante',
      );
    }
    const adotante = this.adotantesRepository.create(createAdotanteDto);
    return this.saveOrThrowConflict(adotante);
  }

  findAll(): Promise<Adotante[]> {
    return this.adotantesRepository.find();
  }

  async findOne(id: string): Promise<Adotante> {
    const adotante = await this.adotantesRepository.findOne({
      where: { id },
    });
    if (!adotante) {
      throw new NotFoundException(`Adotante #${id} não encontrado`);
    }
    return adotante;
  }

  async update(
    id: string,
    updateAdotanteDto: UpdateAdotanteDto,
  ): Promise<Adotante> {
    const adotante = await this.findOne(id);
    Object.assign(adotante, updateAdotanteDto);
    return this.saveOrThrowConflict(adotante);
  }

  async remove(id: string): Promise<void> {
    const adotante = await this.findOne(id);
    await this.adotantesRepository.remove(adotante);
  }

  private saveOrThrowConflict(adotante: Adotante): Promise<Adotante> {
    return saveOrMapPostgresError(
      () => this.adotantesRepository.save(adotante),
      {
        [PostgresErrorCode.UNIQUE_VIOLATION]: () => {
          throw new ConflictException(
            'Já existe um adotante com este CPF ou usuário vinculado',
          );
        },
      },
    );
  }
}
