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
    @InjectRepository(Adocao)
    private readonly adocoesRepository: Repository<Adocao>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createDoadorDto: CreateDoadorDto,
  ): Promise<Doador> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Usuário #${userId} não encontrado`);
    }
    if (user.role && user.role !== RoleUser.DOADOR) {
      throw new ConflictException(
        'Este usuário já possui outro papel na plataforma',
      );
    }

    const existingDoador = await this.doadoresRepository.findOne({
      where: { userId },
    });
    if (existingDoador) {
      throw new ConflictException('Este usuário já possui um perfil de doador');
    }

    return this.dataSource.transaction(async (manager) => {
      const doador = manager.create(Doador, {
        ...createDoadorDto,
        userId,
      });
      const doadorSalvo = await this.saveOrThrowConflict(manager, doador);

      if (!user.role) {
        await manager.update(User, userId, { role: RoleUser.DOADOR });
      }

      return doadorSalvo;
    });
  }

  async findAll(user: RequestUser): Promise<Doador[]> {
    if (user.role === RoleUser.ADMIN) {
      return this.doadoresRepository.find();
    }

    const counterpartSubQuery = this.adocoesRepository
      .createQueryBuilder('adocao')
      .select('pet.doadorId')
      .innerJoin('adocao.adotante', 'adotante')
      .innerJoin('adocao.pet', 'pet')
      .where('adotante.userId = :userId', { userId: user.id });

    return this.doadoresRepository
      .createQueryBuilder('doador')
      .where('doador.userId = :userId', { userId: user.id })
      .orWhere(`doador.id IN (${counterpartSubQuery.getQuery()})`)
      .setParameters(counterpartSubQuery.getParameters())
      .getMany();
  }

  async findOne(user: RequestUser, id: string): Promise<Doador> {
    const doador = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN || doador.userId === user.id) {
      return doador;
    }
    if (await this.isCounterpartAdotante(user.id, id)) {
      return doador;
    }
    throw new NotFoundException(`Doador #${id} não encontrado`);
  }

  async update(
    user: RequestUser,
    id: string,
    updateDoadorDto: UpdateDoadorDto,
  ): Promise<Doador> {
    const doador = await this.authorizeSelfWrite(user, id);
    Object.assign(doador, updateDoadorDto);
    return this.saveOrThrowConflict(this.doadoresRepository.manager, doador);
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    const doador = await this.authorizeSelfWrite(user, id);
    await this.doadoresRepository.remove(doador);
  }

  private async authorizeSelfWrite(
    user: RequestUser,
    id: string,
  ): Promise<Doador> {
    const doador = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN || doador.userId === user.id) {
      return doador;
    }
    if (await this.isCounterpartAdotante(user.id, id)) {
      throw new ForbiddenException(
        'Só o próprio doador pode editar ou remover este perfil',
      );
    }
    throw new NotFoundException(`Doador #${id} não encontrado`);
  }

  private async isCounterpartAdotante(
    userId: string,
    doadorId: string,
  ): Promise<boolean> {
    const count = await this.adocoesRepository
      .createQueryBuilder('adocao')
      .innerJoin('adocao.adotante', 'adotante')
      .innerJoin('adocao.pet', 'pet')
      .where('adotante.userId = :userId', { userId })
      .andWhere('pet.doadorId = :doadorId', { doadorId })
      .getCount();
    return count > 0;
  }

  private async findByIdOrThrow(id: string): Promise<Doador> {
    const doador = await this.doadoresRepository.findOne({ where: { id } });
    if (!doador) {
      throw new NotFoundException(`Doador #${id} não encontrado`);
    }
    return doador;
  }

  private saveOrThrowConflict(
    manager: EntityManager,
    doador: Doador,
  ): Promise<Doador> {
    return saveOrMapPostgresError(() => manager.save(doador), {
      [PostgresErrorCode.UNIQUE_VIOLATION]: () => {
        throw new ConflictException(
          'Já existe um doador com este CPF, CNPJ ou usuário vinculado',
        );
      },
    });
  }
}
