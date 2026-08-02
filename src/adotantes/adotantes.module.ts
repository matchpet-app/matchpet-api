import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adocao } from '../adocoes/entities/adocao.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { AdotantesController } from './adotantes.controller';
import { AdotantesService } from './adotantes.service';
import { Adotante } from './entities/adotante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adotante, Adocao, UserRole])],
  controllers: [AdotantesController],
  providers: [AdotantesService],
  exports: [TypeOrmModule, AdotantesService],
})
export class AdotantesModule {}
