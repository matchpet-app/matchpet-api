import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { AdocaoHistorico } from '../adocoes-historico/entities/adocao-historico.entity';
import { Adotante } from '../adotantes/entities/adotante.entity';
import { Pet } from '../pets/entities/pet.entity';
import { StatusPet } from '../pets/enums/status-pet.enum';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
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

@Injectable()
export class AdocoesService {
  constructor(
    @InjectRepository(Adocao)
    private readonly adocoesRepository: Repository<Adocao>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createAdocaoDto: CreateAdocaoDto): Promise<Adocao> {
    const { termos, ...rest } = createAdocaoDto;

    return this.dataSource.transaction(async (manager) => {
      const [pet, adotante] = await Promise.all([
        manager.findOne(Pet, {
          where: { id: createAdocaoDto.petId },
          lock: { mode: 'pessimistic_write' },
        }),
        manager.findOne(Adotante, {
          where: { id: createAdocaoDto.adotanteId },
        }),
      ]);

      if (!pet) {
        throw new NotFoundException(
          `Pet #${createAdocaoDto.petId} não encontrado`,
        );
      }
      if (!adotante) {
        throw new NotFoundException(
          `Adotante #${createAdocaoDto.adotanteId} não encontrado`,
        );
      }
      if (pet.status !== StatusPet.DISPONIVEL) {
        throw new ConflictException(
          'Este pet não está disponível (já possui uma adoção em andamento ou foi adotado)',
        );
      }

      const adocao = manager.create(Adocao, {
        ...rest,
        termos: { ...termos, aceitosEm: new Date(termos.aceitosEm) },
      });
      const adocaoSalva = await this.saveAdocaoOrThrow(manager, adocao);

      await manager.update(Pet, pet.id, { status: StatusPet.EM_PROCESSO });

      return adocaoSalva;
    });
  }

  findAll(): Promise<Adocao[]> {
    return this.adocoesRepository.find();
  }

  async findOne(id: string): Promise<Adocao> {
    const adocao = await this.adocoesRepository.findOne({ where: { id } });
    if (!adocao) {
      throw new NotFoundException(`Adoção #${id} não encontrada`);
    }
    return adocao;
  }

  async update(id: string, updateAdocaoDto: UpdateAdocaoDto): Promise<Adocao> {
    const adocao = await this.findOne(id);
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

  async remove(id: string): Promise<void> {
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

  private async saveAdocaoOrThrow(
    manager: EntityManager,
    adocao: Adocao,
  ): Promise<Adocao> {
    try {
      return await manager.save(adocao);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code ===
          PostgresErrorCode.FOREIGN_KEY_VIOLATION
      ) {
        throw new NotFoundException('Pet ou adotante vinculado não encontrado');
      }
      throw error;
    }
  }
}
