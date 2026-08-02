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
import { DoadoresService } from './doadores.service';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';
import { Doador } from './entities/doador.entity';

@Controller('doadores')
export class DoadoresController {
  constructor(private readonly doadoresService: DoadoresService) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createDoadorDto: CreateDoadorDto,
  ): Promise<Doador> {
    return this.doadoresService.create(user.id, createDoadorDto);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser): Promise<Doador[]> {
    return this.doadoresService.findAll(user);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Doador> {
    return this.doadoresService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDoadorDto: UpdateDoadorDto,
  ): Promise<Doador> {
    return this.doadoresService.update(user, id, updateDoadorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.doadoresService.remove(user, id);
  }
}
