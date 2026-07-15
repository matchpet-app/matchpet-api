import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { FotosPet } from './entities/fotos-pet.entity';
import { FotosPetController } from './fotos-pet.controller';
import { FotosPetService } from './fotos-pet.service';

@Module({
  imports: [TypeOrmModule.forFeature([FotosPet]), PetsModule],
  controllers: [FotosPetController],
  providers: [FotosPetService],
  exports: [TypeOrmModule],
})
export class FotosPetModule {}
