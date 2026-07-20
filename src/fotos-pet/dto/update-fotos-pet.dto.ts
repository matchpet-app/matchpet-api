import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFotosPetDto } from './create-fotos-pet.dto';

export class UpdateFotosPetDto extends PartialType(
  OmitType(CreateFotosPetDto, ['petId'] as const),
) {}
