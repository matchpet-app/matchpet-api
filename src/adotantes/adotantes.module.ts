import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AdotantesController } from './adotantes.controller';
import { AdotantesService } from './adotantes.service';
import { Adotante } from './entities/adotante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adotante]), UsersModule],
  controllers: [AdotantesController],
  providers: [AdotantesService],
  exports: [TypeOrmModule],
})
export class AdotantesModule {}
