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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestUser } from '../auth/types/request-user';
import { RoleUser } from '../users/enums/role-user.enum';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { Favorito } from './entities/favorito.entity';
import { FavoritosService } from './favoritos.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Roles(RoleUser.ADOTANTE)
  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createFavoritoDto: CreateFavoritoDto,
  ): Promise<Favorito> {
    return this.favoritosService.create(user.id, createFavoritoDto);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser): Promise<Favorito[]> {
    return this.favoritosService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Favorito> {
    return this.favoritosService.findOne(user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.favoritosService.remove(user.id, id);
  }
}
