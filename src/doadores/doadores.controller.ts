import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DoadoresService } from './doadores.service';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';

@Controller('doadores')
export class DoadoresController {
  constructor(private readonly doadoresService: DoadoresService) {}

  @Post()
  create(@Body() createDoadorDto: CreateDoadorDto) {
    return this.doadoresService.create(createDoadorDto);
  }

  @Get()
  findAll() {
    return this.doadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doadoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoadorDto: UpdateDoadorDto) {
    return this.doadoresService.update(id, updateDoadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doadoresService.remove(id);
  }
}
