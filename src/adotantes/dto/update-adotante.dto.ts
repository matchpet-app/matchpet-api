import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAdotanteDto } from './create-adotante.dto';

export class UpdateAdotanteDto extends PartialType(
  OmitType(CreateAdotanteDto, ['userId'] as const),
) {}
