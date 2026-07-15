import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdotantesService } from './adotantes.service';
import { CreateAdotanteDto } from './dto/create-adotante.dto';
import { UpdateAdotanteDto } from './dto/update-adotante.dto';

@Controller('adotantes')
export class AdotantesController {
  constructor(private readonly adotantesService: AdotantesService) {}

  @Post()
  create(@Body() createAdotanteDto: CreateAdotanteDto) {
    return this.adotantesService.create(createAdotanteDto);
  }

  @Get()
  findAll() {
    return this.adotantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adotantesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdotanteDto: UpdateAdotanteDto,
  ) {
    return this.adotantesService.update(id, updateAdotanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adotantesService.remove(id);
  }
}
