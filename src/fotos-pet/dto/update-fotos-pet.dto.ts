import { PartialType } from '@nestjs/mapped-types';
import { CreateFotosPetDto } from './create-fotos-pet.dto';

export class UpdateFotosPetDto extends PartialType(CreateFotosPetDto) {}
