import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAdocaoDto } from './create-adocao.dto';

export class UpdateAdocaoDto extends PartialType(
  OmitType(CreateAdocaoDto, ['petId', 'adotanteId'] as const),
) {}
