import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adotante } from '../adotantes/entities/adotante.entity';
import { Pet } from '../pets/entities/pet.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
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

  async create(
    userId: string,
    createFavoritoDto: CreateFavoritoDto,
  ): Promise<Favorito> {
    const adotante = await this.getOwnAdotante(userId);

    const pet = await this.petsRepository.findOne({
      where: { id: createFavoritoDto.petId },
    });
    if (!pet) {
      throw new NotFoundException(
        `Pet #${createFavoritoDto.petId} não encontrado`,
      );
    }

    const favorito = this.favoritosRepository.create({
      adotanteId: adotante.id,
      petId: createFavoritoDto.petId,
    });
    return saveOrMapPostgresError(
      () => this.favoritosRepository.save(favorito),
      {
        [PostgresErrorCode.UNIQUE_VIOLATION]: () => {
          throw new ConflictException('Este pet já foi favoritado');
        },
        [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: () => {
          throw new NotFoundException(
            'Adotante ou pet vinculado não encontrado',
          );
        },
      },
    );
  }

  async findAll(userId: string): Promise<Favorito[]> {
    const adotante = await this.getOwnAdotante(userId);
    return this.favoritosRepository.find({
      where: { adotanteId: adotante.id },
    });
  }

  async findOne(userId: string, id: string): Promise<Favorito> {
    const adotante = await this.getOwnAdotante(userId);
    const favorito = await this.favoritosRepository.findOne({
      where: { id, adotanteId: adotante.id },
    });
    if (!favorito) {
      throw new NotFoundException(`Favorito #${id} não encontrado`);
    }
    return favorito;
  }

  async remove(userId: string, id: string): Promise<void> {
    const favorito = await this.findOne(userId, id);
    await this.favoritosRepository.remove(favorito);
  }

  private async getOwnAdotante(userId: string): Promise<Adotante> {
    const adotante = await this.adotantesRepository.findOne({
      where: { userId },
    });
    if (!adotante) {
      throw new NotFoundException(
        'Perfil de adotante não encontrado para este usuário',
      );
    }
    return adotante;
  }
}
