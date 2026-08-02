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
import { CreateFotosPetDto } from './dto/create-fotos-pet.dto';
import { UpdateFotosPetDto } from './dto/update-fotos-pet.dto';
import { FotosPet } from './entities/fotos-pet.entity';
import { FotosPetService } from './fotos-pet.service';

@Controller('fotos-pet')
export class FotosPetController {
  constructor(private readonly fotosPetService: FotosPetService) {}

  @Roles(RoleUser.DOADOR)
  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createFotosPetDto: CreateFotosPetDto,
  ): Promise<FotosPet> {
    return this.fotosPetService.create(user, createFotosPetDto);
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
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFotosPetDto: UpdateFotosPetDto,
  ): Promise<FotosPet> {
    return this.fotosPetService.update(user, id, updateFotosPetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.fotosPetService.remove(user, id);
  }
}
