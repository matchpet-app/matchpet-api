import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RequestUser } from '../auth/types/request-user';
import { Doador } from '../doadores/entities/doador.entity';
import { Pet } from '../pets/entities/pet.entity';
import { PostgresErrorCode } from '../shared/database/postgres-error-codes';
import { saveOrMapPostgresError } from '../shared/database/save-or-map-postgres-error';
import { RoleUser } from '../users/enums/role-user.enum';
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
    @InjectRepository(Doador)
    private readonly doadoresRepository: Repository<Doador>,
  ) {}

  async create(
    user: RequestUser,
    createFotosPetDto: CreateFotosPetDto,
  ): Promise<FotosPet> {
    const pet = await this.petsRepository.findOne({
      where: { id: createFotosPetDto.petId },
    });
    if (!pet) {
      throw new NotFoundException(
        `Pet #${createFotosPetDto.petId} não encontrado`,
      );
    }
    await this.assertOwnsPet(user, pet);

    const foto = this.fotosPetRepository.create(createFotosPetDto);
    return saveOrMapPostgresError(() => this.fotosPetRepository.save(foto), {
      [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: () => {
        throw new NotFoundException('Pet vinculado não encontrado');
      },
    });
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
    user: RequestUser,
    id: string,
    updateFotosPetDto: UpdateFotosPetDto,
  ): Promise<FotosPet> {
    const foto = await this.authorizeOwnerWrite(user, id);
    Object.assign(foto, updateFotosPetDto);
    return this.fotosPetRepository.save(foto);
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    const foto = await this.authorizeOwnerWrite(user, id);
    await this.fotosPetRepository.remove(foto);
  }

  private async authorizeOwnerWrite(
    user: RequestUser,
    id: string,
  ): Promise<FotosPet> {
    const foto = await this.findOne(id);
    const pet = await this.petsRepository.findOne({
      where: { id: foto.petId },
    });
    if (!pet) {
      throw new NotFoundException(`Pet #${foto.petId} não encontrado`);
    }
    await this.assertOwnsPet(user, pet);
    return foto;
  }

  private async assertOwnsPet(user: RequestUser, pet: Pet): Promise<void> {
    if (user.role === RoleUser.ADMIN) {
      return;
    }
    const doador = await this.doadoresRepository.findOne({
      where: { userId: user.id },
    });
    if (doador && doador.id === pet.doadorId) {
      return;
    }
    throw new ForbiddenException(
      'Só o doador dono deste pet pode gerenciar suas fotos',
    );
  }
}
