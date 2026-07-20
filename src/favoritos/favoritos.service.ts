import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Adotante } from '../adotantes/entities/adotante.entity';
import { Pet } from '../pets/entities/pet.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { Favorito } from './entities/favorito.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly favoritosRepository: Repository<Favorito>,
    @InjectRepository(Adotante)
    private readonly adotantesRepository: Repository<Adotante>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
  ) {}

  async create(createFavoritoDto: CreateFavoritoDto): Promise<Favorito> {
    const adotante = await this.adotantesRepository.findOne({
      where: { id: createFavoritoDto.adotanteId },
    });
    if (!adotante) {
      throw new NotFoundException(
        `Adotante #${createFavoritoDto.adotanteId} não encontrado`,
      );
    }

    const pet = await this.petsRepository.findOne({
      where: { id: createFavoritoDto.petId },
    });
    if (!pet) {
      throw new NotFoundException(
        `Pet #${createFavoritoDto.petId} não encontrado`,
      );
    }

    const favorito = this.favoritosRepository.create(createFavoritoDto);
    return this.saveOrThrow(favorito);
  }

  findAll(): Promise<Favorito[]> {
    return this.favoritosRepository.find();
  }

  async findOne(id: string): Promise<Favorito> {
    const favorito = await this.favoritosRepository.findOne({
      where: { id },
    });
    if (!favorito) {
      throw new NotFoundException(`Favorito #${id} não encontrado`);
    }
    return favorito;
  }

  async remove(id: string): Promise<void> {
    const favorito = await this.findOne(id);
    await this.favoritosRepository.remove(favorito);
  }

  private async saveOrThrow(favorito: Favorito): Promise<Favorito> {
    try {
      return await this.favoritosRepository.save(favorito);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error.driverError as { code?: string })?.code;
        if (code === PostgresErrorCode.UNIQUE_VIOLATION) {
          throw new ConflictException('Este pet já foi favoritado');
        }
        if (code === PostgresErrorCode.FOREIGN_KEY_VIOLATION) {
          throw new NotFoundException(
            'Adotante ou pet vinculado não encontrado',
          );
        }
      }
      throw error;
    }
  }
}
