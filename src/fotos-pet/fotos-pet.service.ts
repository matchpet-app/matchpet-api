import { Injectable } from '@nestjs/common';
import { CreateFotosPetDto } from './dto/create-fotos-pet.dto';
import { UpdateFotosPetDto } from './dto/update-fotos-pet.dto';

@Injectable()
export class FotosPetService {
  create(createFotosPetDto: CreateFotosPetDto) {
    return 'This action adds a new fotosPet';
  }

  findAll() {
    return `This action returns all fotosPet`;
  }

  findOne(id: string) {
    return `This action returns a #${id} fotosPet`;
  }

  update(id: string, updateFotosPetDto: UpdateFotosPetDto) {
    return `This action updates a #${id} fotosPet`;
  }

  remove(id: string) {
    return `This action removes a #${id} fotosPet`;
  }
}
