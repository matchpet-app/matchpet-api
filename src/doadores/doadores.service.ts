import { Injectable } from '@nestjs/common';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';

@Injectable()
export class DoadoresService {
  create(createDoadorDto: CreateDoadorDto) {
    return 'This action adds a new doadore';
  }

  findAll() {
    return `This action returns all doadores`;
  }

  findOne(id: string) {
    return `This action returns a #${id} doadore`;
  }

  update(id: string, updateDoadorDto: UpdateDoadorDto) {
    return `This action updates a #${id} doadore`;
  }

  remove(id: string) {
    return `This action removes a #${id} doadore`;
  }
}
