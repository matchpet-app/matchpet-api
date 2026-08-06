import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';
import { CepResult } from './cep.types';

@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  buscar(@Param('cep') cep: string): Promise<CepResult> {
    return this.cepService.buscar(cep);
  }
}
