import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Pet } from '../pets/entities/pet.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { CreateFotosPetDto } from './dto/create-fotos-pet.dto';
import { UpdateFotosPetDto } from './dto/update-fotos-pet.dto';
import { FotosPet } from './entities/fotos-pet.entity';

@Injectable()
export class FotosPetService {
  constructor(
    @InjectRepository(FotosPet)
    private readonly fotosPetRepository: Repository<FotosPet>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
  ) {}

  async create(createFotosPetDto: CreateFotosPetDto): Promise<FotosPet> {
    const pet = await this.petsRepository.findOne({
      where: { id: createFotosPetDto.petId },
    });
    if (!pet) {
      throw new NotFoundException(
        `Pet #${createFotosPetDto.petId} não encontrado`,
      );
    }

    const foto = this.fotosPetRepository.create(createFotosPetDto);
    return this.saveOrThrowNotFound(foto);
  }

  findAll(): Promise<FotosPet[]> {
    return this.fotosPetRepository.find();
  }

  async findOne(id: string): Promise<FotosPet> {
    const foto = await this.fotosPetRepository.findOne({ where: { id } });
    if (!foto) {
      throw new NotFoundException(`Foto #${id} não encontrada`);
    }
    return foto;
  }

  async update(
    id: string,
    updateFotosPetDto: UpdateFotosPetDto,
  ): Promise<FotosPet> {
    const foto = await this.findOne(id);
    Object.assign(foto, updateFotosPetDto);
    return this.fotosPetRepository.save(foto);
  }

  async remove(id: string): Promise<void> {
    const foto = await this.findOne(id);
    await this.fotosPetRepository.remove(foto);
  }

  private async saveOrThrowNotFound(foto: FotosPet): Promise<FotosPet> {
    try {
      return await this.fotosPetRepository.save(foto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code ===
          PostgresErrorCode.FOREIGN_KEY_VIOLATION
      ) {
        throw new NotFoundException('Pet vinculado não encontrado');
      }
      throw error;
    }
  }
}
