import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/types/request-user';
import { AdotantesService } from './adotantes.service';
import { CreateAdotanteDto } from './dto/create-adotante.dto';
import { UpdateAdotanteDto } from './dto/update-adotante.dto';
import { Adotante } from './entities/adotante.entity';

@Controller('adotantes')
export class AdotantesController {
  constructor(private readonly adotantesService: AdotantesService) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createAdotanteDto: CreateAdotanteDto,
  ): Promise<Adotante> {
    return this.adotantesService.create(user.id, createAdotanteDto);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser): Promise<Adotante[]> {
    return this.adotantesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Adotante> {
    return this.adotantesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdotanteDto: UpdateAdotanteDto,
  ): Promise<Adotante> {
    return this.adotantesService.update(user, id, updateAdotanteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.adotantesService.remove(user, id);
  }
}
