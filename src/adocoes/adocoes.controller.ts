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
import { AdocoesService } from './adocoes.service';
import { CreateAdocaoDto } from './dto/create-adocao.dto';
import { MudarStatusAdocaoDto } from './dto/mudar-status-adocao.dto';
import { UpdateAdocaoDto } from './dto/update-adocao.dto';
import { Adocao } from './entities/adocao.entity';

@Controller('adocoes')
export class AdocoesController {
  constructor(private readonly adocoesService: AdocoesService) {}

  @Post()
  create(@Body() createAdocoeDto: CreateAdocaoDto): Promise<Adocao> {
    return this.adocoesService.create(createAdocoeDto);
  }

  @Get()
  findAll(): Promise<Adocao[]> {
    return this.adocoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Adocao> {
    return this.adocoesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdocoeDto: UpdateAdocaoDto,
  ): Promise<Adocao> {
    return this.adocoesService.update(id, updateAdocoeDto);
  }

  @Patch(':id/status')
  mudarStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() mudarStatusDto: MudarStatusAdocaoDto,
  ): Promise<Adocao> {
    return this.adocoesService.mudarStatus(id, mudarStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adocoesService.remove(id);
  }
}
