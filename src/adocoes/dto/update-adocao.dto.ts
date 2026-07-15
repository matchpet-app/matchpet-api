import { PartialType } from '@nestjs/mapped-types';
import { CreateAdocaoDto } from './create-adocao.dto';

export class UpdateAdocaoDto extends PartialType(CreateAdocaoDto) {}
