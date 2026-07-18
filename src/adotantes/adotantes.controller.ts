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
import { AdotantesService } from './adotantes.service';
import { CreateAdotanteDto } from './dto/create-adotante.dto';
import { UpdateAdotanteDto } from './dto/update-adotante.dto';
import { Adotante } from './entities/adotante.entity';

@Controller('adotantes')
export class AdotantesController {
  constructor(private readonly adotantesService: AdotantesService) {}

  @Post()
  create(@Body() createAdotanteDto: CreateAdotanteDto) {
    return this.adotantesService.create(createAdotanteDto);
  }

  @Get()
  findAll(): Promise<Adotante[]> {
    return this.adotantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Adotante> {
    return this.adotantesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdotanteDto: UpdateAdotanteDto,
  ): Promise<Adotante> {
    return this.adotantesService.update(id, updateAdotanteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adotantesService.remove(id);
  }
}
