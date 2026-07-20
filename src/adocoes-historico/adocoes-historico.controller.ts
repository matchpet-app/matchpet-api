import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AdocoesHistoricoService } from './adocoes-historico.service';
import { AdocaoHistorico } from './entities/adocao-historico.entity';

@Controller('adocoes-historico')
export class AdocoesHistoricoController {
  constructor(
    private readonly adocoesHistoricoService: AdocoesHistoricoService,
  ) {}

  @Get()
  findAll(): Promise<AdocaoHistorico[]> {
    return this.adocoesHistoricoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AdocaoHistorico> {
    return this.adocoesHistoricoService.findOne(id);
  }
}
