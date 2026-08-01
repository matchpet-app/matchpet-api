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
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestUser } from '../auth/types/request-user';
import { RoleUser } from '../users/enums/role-user.enum';
import { AdocoesService } from './adocoes.service';
import { CreateAdocaoDto } from './dto/create-adocao.dto';
import { MudarStatusAdocaoDto } from './dto/mudar-status-adocao.dto';
import { UpdateAdocaoDto } from './dto/update-adocao.dto';
import { Adocao } from './entities/adocao.entity';

@Controller('adocoes')
export class AdocoesController {
  constructor(private readonly adocoesService: AdocoesService) {}

  @Roles(RoleUser.ADOTANTE)
  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createAdocaoDto: CreateAdocaoDto,
  ): Promise<Adocao> {
    return this.adocoesService.create(user.id, createAdocaoDto);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser): Promise<Adocao[]> {
    return this.adocoesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Adocao> {
    return this.adocoesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdocoeDto: UpdateAdocaoDto,
  ): Promise<Adocao> {
    return this.adocoesService.update(user, id, updateAdocoeDto);
  }

  @Roles(RoleUser.ADOTANTE, RoleUser.DOADOR, RoleUser.ADMIN)
  @Patch(':id/status')
  mudarStatus(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() mudarStatusDto: MudarStatusAdocaoDto,
  ): Promise<Adocao> {
    return this.adocoesService.mudarStatus(user, id, mudarStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.adocoesService.remove(user, id);
  }
}
