import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Adocao } from '../adocoes/entities/adocao.entity';
import type { RequestUser } from '../auth/types/request-user';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { User } from '../users/entities/user.entity';
import { RoleUser } from '../users/enums/role-user.enum';
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
    @InjectRepository(Adocao)
    private readonly adocoesRepository: Repository<Adocao>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createAdotanteDto: CreateAdotanteDto,
  ): Promise<Adotante> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Usuário #${userId} não encontrado`);
    }
    if (user.role && user.role !== RoleUser.ADOTANTE) {
      throw new ConflictException(
        'Este usuário já possui outro papel na plataforma',
      );
    }
    const existingAdotante = await this.adotantesRepository.findOne({
      where: { userId },
    });
    if (existingAdotante) {
      throw new ConflictException(
        'Este usuário já possui um perfil de adotante',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const adotante = manager.create(Adotante, {
        ...createAdotanteDto,
        userId,
      });
      const adotanteSalvo = await this.saveOrThrowConflict(manager, adotante);

      if (!user.role) {
        await manager.update(User, userId, { role: RoleUser.ADOTANTE });
      }

      return adotanteSalvo;
    });
  }

  async findAll(user: RequestUser): Promise<Adotante[]> {
    if (user.role === RoleUser.ADMIN) {
      return this.adotantesRepository.find();
    }

    const counterpartSubQuery = this.adocoesRepository
      .createQueryBuilder('adocao')
      .select('adocao.adotanteId')
      .innerJoin('adocao.pet', 'pet')
      .innerJoin('pet.doador', 'doador')
      .where('doador.userId = :userId', { userId: user.id });

    return this.adotantesRepository
      .createQueryBuilder('adotante')
      .where('adotante.userId = :userId', { userId: user.id })
      .orWhere(`adotante.id IN (${counterpartSubQuery.getQuery()})`)
      .setParameters(counterpartSubQuery.getParameters())
      .getMany();
  }

  async findOne(user: RequestUser, id: string): Promise<Adotante> {
    const adotante = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN || adotante.userId === user.id) {
      return adotante;
    }
    if (await this.isCounterpartDoador(user.id, id)) {
      return adotante;
    }
    throw new NotFoundException(`Adotante #${id} não encontrado`);
  }

  async update(
    user: RequestUser,
    id: string,
    updateAdotanteDto: UpdateAdotanteDto,
  ): Promise<Adotante> {
    const adotante = await this.authorizeSelfWrite(user, id);
    Object.assign(adotante, updateAdotanteDto);
    return this.saveOrThrowConflict(this.adotantesRepository.manager, adotante);
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    const adotante = await this.authorizeSelfWrite(user, id);
    await this.adotantesRepository.remove(adotante);
  }

  private async authorizeSelfWrite(
    user: RequestUser,
    id: string,
  ): Promise<Adotante> {
    const adotante = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN || adotante.userId === user.id) {
      return adotante;
    }
    if (await this.isCounterpartDoador(user.id, id)) {
      throw new ForbiddenException(
        'Só o próprio adotante pode editar ou remover este perfil',
      );
    }
    throw new NotFoundException(`Adotante #${id} não encontrado`);
  }

  private async isCounterpartDoador(
    userId: string,
    adotanteId: string,
  ): Promise<boolean> {
    const count = await this.adocoesRepository
      .createQueryBuilder('adocao')
      .innerJoin('adocao.pet', 'pet')
      .innerJoin('pet.doador', 'doador')
      .where('adocao.adotanteId = :adotanteId', { adotanteId })
      .andWhere('doador.userId = :userId', { userId })
      .getCount();
    return count > 0;
  }

  private async findByIdOrThrow(id: string): Promise<Adotante> {
    const adotante = await this.adotantesRepository.findOne({
      where: { id },
    });
    if (!adotante) {
      throw new NotFoundException(`Adotante #${id} não encontrado`);
    }
    return adotante;
  }

  private saveOrThrowConflict(
    manager: EntityManager,
    adotante: Adotante,
  ): Promise<Adotante> {
    return saveOrMapPostgresError(() => manager.save(adotante), {
      [PostgresErrorCode.UNIQUE_VIOLATION]: () => {
        throw new ConflictException(
          'Já existe um adotante com este CPF ou usuário vinculado',
        );
      },
    });
  }
}
