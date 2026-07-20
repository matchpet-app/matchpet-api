import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdocoesHistoricoModule } from 'src/adocoes-historico/adocoes-historico.module';
import { AdotantesModule } from '../adotantes/adotantes.module';
import { PetsModule } from '../pets/pets.module';
import { AdocoesController } from './adocoes.controller';
import { AdocoesService } from './adocoes.service';
import { Adocao } from './entities/adocao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adocao]),
    PetsModule,
    AdotantesModule,
    AdocoesHistoricoModule,
  ],
  controllers: [AdocoesController],
  providers: [AdocoesService],
  exports: [TypeOrmModule],
})
export class AdocoesModule {}
