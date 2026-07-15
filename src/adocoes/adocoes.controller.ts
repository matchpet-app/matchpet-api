import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdocoesService } from './adocoes.service';
import { CreateAdocaoDto } from './dto/create-adocao.dto';
import { UpdateAdocaoDto } from './dto/update-adocao.dto';

@Controller('adocoes')
export class AdocoesController {
  constructor(private readonly adocoesService: AdocoesService) {}

  @Post()
  create(@Body() createAdocoeDto: CreateAdocaoDto) {
    return this.adocoesService.create(createAdocoeDto);
  }

  @Get()
  findAll() {
    return this.adocoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adocoesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdocoeDto: UpdateAdocaoDto) {
    return this.adocoesService.update(id, updateAdocoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adocoesService.remove(id);
  }
}
