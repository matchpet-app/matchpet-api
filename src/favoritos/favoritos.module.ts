import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdotantesModule } from '../adotantes/adotantes.module';
import { PetsModule } from '../pets/pets.module';
import { Favorito } from './entities/favorito.entity';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito]), AdotantesModule, PetsModule],
  controllers: [FavoritosController],
  providers: [FavoritosService],
  exports: [TypeOrmModule],
})
export class FavoritosModule {}
