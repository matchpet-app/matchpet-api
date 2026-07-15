import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFotosPetDto } from './dto/create-fotos-pet.dto';
import { UpdateFotosPetDto } from './dto/update-fotos-pet.dto';
import { FotosPetService } from './fotos-pet.service';

@Controller('fotos-pet')
export class FotosPetController {
  constructor(private readonly fotosPetService: FotosPetService) {}

  @Post()
  create(@Body() createFotosPetDto: CreateFotosPetDto) {
    return this.fotosPetService.create(createFotosPetDto);
  }

  @Get()
  findAll() {
    return this.fotosPetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fotosPetService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFotosPetDto: UpdateFotosPetDto,
  ) {
    return this.fotosPetService.update(id, updateFotosPetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fotosPetService.remove(id);
  }
}
