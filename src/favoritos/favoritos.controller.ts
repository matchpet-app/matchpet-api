import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { FavoritosService } from './favoritos.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  create(@Body() createFavoritoDto: CreateFavoritoDto) {
    return this.favoritosService.create(createFavoritoDto);
  }

  @Get()
  findAll() {
    return this.favoritosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritosService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritosService.remove(id);
  }
}
