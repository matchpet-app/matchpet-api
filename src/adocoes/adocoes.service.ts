import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AdocaoHistorico } from '../adocoes-historico/entities/adocao-historico.entity';
import { Adotante } from '../adotantes/entities/adotante.entity';
import type { RequestUser } from '../auth/types/request-user';
import { Pet } from '../pets/entities/pet.entity';
import { StatusPet } from '../pets/enums/status-pet.enum';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { RoleUser } from '../users/enums/role-user.enum';
import { CreateAdocaoDto } from './dto/create-adocao.dto';
import { MudarStatusAdocaoDto } from './dto/mudar-status-adocao.dto';
import { UpdateAdocaoDto } from './dto/update-adocao.dto';
import { Adocao } from './entities/adocao.entity';
import { StatusAdocao } from './enums/status-adocao.enum';

const TRANSICOES_PERMITIDAS: Record<StatusAdocao, StatusAdocao[]> = {
  [StatusAdocao.PENDENTE]: [
    StatusAdocao.APROVADO,
    StatusAdocao.REJEITADO,
    StatusAdocao.CANCELADO,
  ],
  [StatusAdocao.APROVADO]: [StatusAdocao.CONCLUIDO, StatusAdocao.CANCELADO],
  [StatusAdocao.REJEITADO]: [],
  [StatusAdocao.CONCLUIDO]: [],
  [StatusAdocao.CANCELADO]: [],
};

const STATUS_TERMINAIS: StatusAdocao[] = [
  StatusAdocao.REJEITADO,
  StatusAdocao.CONCLUIDO,
  StatusAdocao.CANCELADO,
];

const STATUS_SOMENTE_DOADOR: StatusAdocao[] = [
  StatusAdocao.APROVADO,
  StatusAdocao.REJEITADO,
];

interface OwnershipFlags {
  isAdotanteOwner: boolean;
  isDoadorOwner: boolean;
}

@Injectable()
export class AdocoesService {
  constructor(
    @InjectRepository(Adocao)
    private readonly adocoesRepository: Repository<Adocao>,
    @InjectRepository(Adotante)
    private readonly adotantesRepository: Repository<Adotante>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createAdocaoDto: CreateAdocaoDto,
  ): Promise<Adocao> {
    const adotante = await this.getOwnAdotante(userId);
    const { termos, ...rest } = createAdocaoDto;

    return this.dataSource.transaction(async (manager) => {
      const pet = await manager.findOne(Pet, {
        where: { id: createAdocaoDto.petId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!pet) {
        throw new NotFoundException(
          `Pet #${createAdocaoDto.petId} não encontrado`,
        );
      }
      if (pet.status !== StatusPet.DISPONIVEL) {
        throw new ConflictException(
          'Este pet não está disponível (já possui uma adoção em andamento ou foi adotado)',
        );
      }

      const adocao = manager.create(Adocao, {
        ...rest,
        adotanteId: adotante.id,
        termos: { ...termos, aceitosEm: new Date(termos.aceitosEm) },
      });
      const adocaoSalva = await this.saveAdocaoOrThrow(manager, adocao);

      await manager.update(Pet, pet.id, { status: StatusPet.EM_PROCESSO });

      return adocaoSalva;
    });
  }

  async findAll(user: RequestUser): Promise<Adocao[]> {
    if (user.role === RoleUser.ADMIN) {
      return this.adocoesRepository.find();
    }

    return this.adocoesRepository
      .createQueryBuilder('adocao')
      .innerJoin('adocao.adotante', 'adotante')
      .innerJoin('adocao.pet', 'pet')
      .innerJoin('pet.doador', 'doador')
      .where('adotante.userId = :userId OR doador.userId = :userId', {
        userId: user.id,
      })
      .getMany();
  }

  async findOne(user: RequestUser, id: string): Promise<Adocao> {
    const adocao = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN) {
      return adocao;
    }

    const { isAdotanteOwner, isDoadorOwner } = await this.resolveOwnership(
      user.id,
      adocao,
    );
    if (!isAdotanteOwner && !isDoadorOwner) {
      throw new NotFoundException(`Adoção #${id} não encontrada`);
    }
    return adocao;
  }

  async update(
    user: RequestUser,
    id: string,
    updateAdocaoDto: UpdateAdocaoDto,
  ): Promise<Adocao> {
    const adocao = await this.authorizeAdotanteWrite(user, id);
    if (STATUS_TERMINAIS.includes(adocao.status)) {
      throw new ConflictException(
        `Não é possível editar uma adoção com status '${adocao.status}'`,
      );
    }

    const { termos, ...rest } = updateAdocaoDto;

    Object.assign(adocao, rest);
    if (termos) {
      adocao.termos = { ...termos, aceitosEm: new Date(termos.aceitosEm) };
    }

    return this.adocoesRepository.save(adocao);
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    await this.authorizeAdotanteWrite(user, id);

    await this.dataSource.transaction(async (manager) => {
      const adocao = await manager.findOne(Adocao, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!adocao) {
        throw new NotFoundException(`Adoção #${id} não encontrada`);
      }

      await manager.remove(adocao);

      if (!STATUS_TERMINAIS.includes(adocao.status)) {
        await manager.update(Pet, adocao.petId, {
          status: StatusPet.DISPONIVEL,
        });
      }
    });
  }

  async mudarStatus(
    user: RequestUser,
    id: string,
    mudarStatusDto: MudarStatusAdocaoDto,
  ): Promise<Adocao> {
    const { novoStatus, observacao } = mudarStatusDto;

    return this.dataSource.transaction(async (manager) => {
      const adocao = await manager.findOne(Adocao, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!adocao) {
        throw new NotFoundException(`Adoção #${id} não encontrada`);
      }

      if (user.role !== RoleUser.ADMIN) {
        const { isAdotanteOwner, isDoadorOwner } = await this.resolveOwnership(
          user.id,
          adocao,
          manager,
        );
        if (!isAdotanteOwner && !isDoadorOwner) {
          throw new NotFoundException(`Adoção #${id} não encontrada`);
        }
        if (STATUS_SOMENTE_DOADOR.includes(novoStatus) && !isDoadorOwner) {
          throw new ForbiddenException(
            'Só o doador do pet pode aprovar ou rejeitar esta adoção',
          );
        }
      }

      const statusAnterior = adocao.status;
      if (!TRANSICOES_PERMITIDAS[statusAnterior].includes(novoStatus)) {
        throw new ConflictException(
          `Não é possível mudar o status de '${statusAnterior}' para '${novoStatus}'`,
        );
      }

      adocao.status = novoStatus;
      if (novoStatus === StatusAdocao.CONCLUIDO) {
        adocao.dataConclusao = new Date();
      }
      const adocaoAtualizada = await manager.save(adocao);

      await manager.insert(AdocaoHistorico, {
        adocaoId: adocao.id,
        statusAnterior,
        statusNovo: novoStatus,
        observacao,
      });

      const novoStatusPet = this.statusPetParaNovoStatusAdocao(novoStatus);
      if (novoStatusPet) {
        await manager.update(Pet, adocao.petId, { status: novoStatusPet });
      }

      return adocaoAtualizada;
    });
  }

  private async authorizeAdotanteWrite(
    user: RequestUser,
    id: string,
  ): Promise<Adocao> {
    const adocao = await this.findByIdOrThrow(id);
    if (user.role === RoleUser.ADMIN) {
      return adocao;
    }

    const { isAdotanteOwner, isDoadorOwner } = await this.resolveOwnership(
      user.id,
      adocao,
    );
    if (isAdotanteOwner) {
      return adocao;
    }
    if (isDoadorOwner) {
      throw new ForbiddenException(
        'Só o adotante desta adoção pode editar ou remover este registro',
      );
    }
    throw new NotFoundException(`Adoção #${id} não encontrada`);
  }

  private async resolveOwnership(
    userId: string,
    adocao: Adocao,
    manager?: EntityManager,
  ): Promise<OwnershipFlags> {
    const adotantesRepo = manager
      ? manager.getRepository(Adotante)
      : this.adotantesRepository;
    const petsRepo = manager ? manager.getRepository(Pet) : this.petsRepository;

    const [adotante, pet] = await Promise.all([
      adotantesRepo.findOne({ where: { id: adocao.adotanteId } }),
      petsRepo.findOne({
        where: { id: adocao.petId },
        relations: { doador: true },
      }),
    ]);

    return {
      isAdotanteOwner: adotante?.userId === userId,
      isDoadorOwner: pet?.doador.userId === userId,
    };
  }

  private async findByIdOrThrow(id: string): Promise<Adocao> {
    const adocao = await this.adocoesRepository.findOne({ where: { id } });
    if (!adocao) {
      throw new NotFoundException(`Adoção #${id} não encontrada`);
    }
    return adocao;
  }

  private async getOwnAdotante(userId: string): Promise<Adotante> {
    const adotante = await this.adotantesRepository.findOne({
      where: { userId },
    });
    if (!adotante) {
      throw new NotFoundException(
        'Perfil de adotante não encontrado para este usuário',
      );
    }
    return adotante;
  }

  private statusPetParaNovoStatusAdocao(
    novoStatus: StatusAdocao,
  ): StatusPet | undefined {
    switch (novoStatus) {
      case StatusAdocao.CONCLUIDO:
        return StatusPet.ADOTADO;
      case StatusAdocao.REJEITADO:
      case StatusAdocao.CANCELADO:
        return StatusPet.DISPONIVEL;
      default:
        return undefined;
    }
  }

  private saveAdocaoOrThrow(
    manager: EntityManager,
    adocao: Adocao,
  ): Promise<Adocao> {
    return saveOrMapPostgresError(() => manager.save(adocao), {
      [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: () => {
        throw new NotFoundException('Pet ou adotante vinculado não encontrado');
      },
    });
  }
}
