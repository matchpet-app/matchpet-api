import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doador } from '../doadores/entities/doador.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
    @InjectRepository(Doador)
    private readonly doadoresRepository: Repository<Doador>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const doador = await this.doadoresRepository.findOne({
      where: { id: createPetDto.doadorId },
    });
    if (!doador) {
      throw new NotFoundException(
        `Doador #${createPetDto.doadorId} não encontrado`,
      );
    }

    const pet = this.petsRepository.create(createPetDto);
    return saveOrMapPostgresError(() => this.petsRepository.save(pet), {
      [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: () => {
        throw new NotFoundException('Doador vinculado não encontrado');
      },
    });
  }

  findAll(): Promise<Pet[]> {
    return this.petsRepository.find();
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petsRepository.findOne({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet #${id} não encontrado`);
    }
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.findOne(id);
    Object.assign(pet, updatePetDto);
    return this.petsRepository.save(pet);
  }

  async remove(id: string): Promise<void> {
    const pet = await this.findOne(id);
    await this.petsRepository.remove(pet);
  }
}
