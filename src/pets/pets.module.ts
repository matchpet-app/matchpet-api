import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoadoresModule } from '../doadores/doadores.module';
import { Pet } from './entities/pet.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), DoadoresModule],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [TypeOrmModule],
})
export class PetsModule {}
