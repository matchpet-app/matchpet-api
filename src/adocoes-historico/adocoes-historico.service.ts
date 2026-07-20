import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdocaoHistorico } from './entities/adocao-historico.entity';

@Injectable()
export class AdocoesHistoricoService {
  constructor(
    @InjectRepository(AdocaoHistorico)
    private readonly historicoRepository: Repository<AdocaoHistorico>,
  ) {}

  findAll(): Promise<AdocaoHistorico[]> {
    return this.historicoRepository.find();
  }

  async findOne(id: string): Promise<AdocaoHistorico> {
    const historico = await this.historicoRepository.findOne({
      where: { id },
    });
    if (!historico) {
      throw new NotFoundException(
        `Registro de histórico #${id} não encontrado`,
      );
    }
    return historico;
  }
}
