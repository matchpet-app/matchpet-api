import { Controller, Get, Param } from '@nestjs/common';
import { AdocoesHistoricoService } from './adocoes-historico.service';

@Controller('adocoes-historico')
export class AdocoesHistoricoController {
  constructor(
    private readonly adocoesHistoricoService: AdocoesHistoricoService,
  ) {}

  @Get()
  findAll() {
    return this.adocoesHistoricoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adocoesHistoricoService.findOne(id);
  }
}
