import { Injectable } from '@nestjs/common';
import { CreateAdocaoDto } from './dto/create-adocao.dto';
import { UpdateAdocaoDto } from './dto/update-adocao.dto';

@Injectable()
export class AdocoesService {
  create(createAdocoeDto: CreateAdocaoDto) {
    return 'This action adds a new adocoe';
  }

  findAll() {
    return `This action returns all adocoes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} adocoe`;
  }

  update(id: string, updateAdocaoDto: UpdateAdocaoDto) {
    return `This action updates a #${id} adocoe`;
  }

  remove(id: string) {
    return `This action removes a #${id} adocoe`;
  }
}
