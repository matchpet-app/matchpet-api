import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adocao } from '../adocoes/entities/adocao.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { DoadoresController } from './doadores.controller';
import { DoadoresService } from './doadores.service';
import { Doador } from './entities/doador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doador, Adocao, UserRole])],
  controllers: [DoadoresController],
  providers: [DoadoresService],
  exports: [TypeOrmModule, DoadoresService],
})
export class DoadoresModule {}
