import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DoadoresController } from './doadores.controller';
import { DoadoresService } from './doadores.service';
import { Doador } from './entities/doador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doador]), UsersModule],
  controllers: [DoadoresController],
  providers: [DoadoresService],
  exports: [TypeOrmModule],
})
export class DoadoresModule {}
