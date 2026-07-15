import { Injectable } from '@nestjs/common';

@Injectable()
export class AdocoesHistoricoService {
  findAll() {
    return `This action returns all adocoesHistorico`;
  }

  findOne(id: string) {
    return `This action returns a #${id} adocoesHistorico`;
  }
}
