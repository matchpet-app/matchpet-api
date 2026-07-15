import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UF } from '../enums/uf.enum';

export class EnderecoDto {
  @IsString()
  cep: string;

  @IsEnum(UF)
  uf: UF;

  @IsString()
  cidade: string;

  @IsString()
  bairro: string;

  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}
