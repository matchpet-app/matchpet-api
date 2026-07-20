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
import { CreateFotosPetDto } from './dto/create-fotos-pet.dto';
import { UpdateFotosPetDto } from './dto/update-fotos-pet.dto';
import { FotosPet } from './entities/fotos-pet.entity';
import { FotosPetService } from './fotos-pet.service';

@Controller('fotos-pet')
export class FotosPetController {
  constructor(private readonly fotosPetService: FotosPetService) {}

  @Post()
  create(@Body() createFotosPetDto: CreateFotosPetDto): Promise<FotosPet> {
    return this.fotosPetService.create(createFotosPetDto);
  }

  @Get()
  findAll(): Promise<FotosPet[]> {
    return this.fotosPetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FotosPet> {
    return this.fotosPetService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFotosPetDto: UpdateFotosPetDto,
  ): Promise<FotosPet> {
    return this.fotosPetService.update(id, updateFotosPetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fotosPetService.remove(id);
  }
}
