import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdocoesHistoricoController } from './adocoes-historico.controller';
import { AdocoesHistoricoService } from './adocoes-historico.service';
import { AdocaoHistorico } from './entities/adocao-historico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdocaoHistorico])],
  controllers: [AdocoesHistoricoController],
  providers: [AdocoesHistoricoService],
  exports: [TypeOrmModule],
})
export class AdocoesHistoricoModule {}
