import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RequestUser } from '../auth/types/request-user';
import { Doador } from '../doadores/entities/doador.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { RoleUser } from '../users/enums/role-user.enum';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

interface DoadorPublico {
  id: string;
  nomeExibicao: string;
  cidade: string;
  uf: string;
}

export type PetPublico = Omit<Pet, 'doador'> & { doador: DoadorPublico };

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
    @InjectRepository(Doador)
    private readonly doadoresRepository: Repository<Doador>,
  ) {}

  async create(userId: string, createPetDto: CreatePetDto): Promise<Pet> {
    const doador = await this.getOwnDoador(userId);

    const pet = this.petsRepository.create({
      ...createPetDto,
      doadorId: doador.id,
    });
    return saveOrMapPostgresError(() => this.petsRepository.save(pet), {
      [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: () => {
        throw new NotFoundException('Doador vinculado não encontrado');
      },
    });
  }

  async findAll(): Promise<PetPublico[]> {
    const pets = await this.petsRepository.find({
      relations: { doador: true },
    });
    return pets.map((pet) => this.toPetPublico(pet));
  }

  async findOne(id: string): Promise<PetPublico> {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: { doador: true },
    });
    if (!pet) {
      throw new NotFoundException(`Pet #${id} não encontrado`);
    }
    return this.toPetPublico(pet);
  }

  async update(
    user: RequestUser,
    id: string,
    updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    const pet = await this.authorizeOwnerWrite(user, id);
    Object.assign(pet, updatePetDto);
    return this.petsRepository.save(pet);
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    const pet = await this.authorizeOwnerWrite(user, id);
    await this.petsRepository.remove(pet);
  }

  private async authorizeOwnerWrite(
    user: RequestUser,
    id: string,
  ): Promise<Pet> {
    const pet = await this.petsRepository.findOne({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet #${id} não encontrado`);
    }
    if (user.role === RoleUser.ADMIN) {
      return pet;
    }
    const doador = await this.doadoresRepository.findOne({
      where: { userId: user.id },
    });
    if (doador && doador.id === pet.doadorId) {
      return pet;
    }
    throw new ForbiddenException(
      'Só o doador dono deste pet pode editar ou remover',
    );
  }

  private async getOwnDoador(userId: string): Promise<Doador> {
    const doador = await this.doadoresRepository.findOne({
      where: { userId },
    });
    if (!doador) {
      throw new NotFoundException(
        'Perfil de doador não encontrado para este usuário',
      );
    }
    return doador;
  }

  private toPetPublico(pet: Pet): PetPublico {
    const { doador, ...rest } = pet;
    return {
      ...rest,
      doador: {
        id: doador.id,
        nomeExibicao: doador.nomeExibicao,
        cidade: doador.endereco.cidade,
        uf: doador.endereco.uf,
      },
    };
  }
}
