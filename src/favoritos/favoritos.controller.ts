import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { Favorito } from './entities/favorito.entity';
import { FavoritosService } from './favoritos.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  create(@Body() createFavoritoDto: CreateFavoritoDto): Promise<Favorito> {
    return this.favoritosService.create(createFavoritoDto);
  }

  @Get()
  findAll(): Promise<Favorito[]> {
    return this.favoritosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Favorito> {
    return this.favoritosService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.favoritosService.remove(id);
  }
}
