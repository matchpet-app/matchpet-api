import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DoadoresService } from './doadores.service';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';
import { Doador } from './entities/doador.entity';

@Controller('doadores')
export class DoadoresController {
  constructor(private readonly doadoresService: DoadoresService) {}

  @Post()
  create(@Body() createDoadorDto: CreateDoadorDto): Promise<Doador> {
    return this.doadoresService.create(createDoadorDto);
  }

  @Get()
  findAll(): Promise<Doador[]> {
    return this.doadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Doador> {
    return this.doadoresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoadorDto: UpdateDoadorDto,
  ): Promise<Doador> {
    return this.doadoresService.update(id, updateDoadorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.doadoresService.remove(id);
  }
}
