import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { IsCPF } from 'cpf-cnpj-validator/class-validator';
import { EnderecoDto } from '../../shared/dto/endereco.dto';
import { NormalizeCpf } from '../../shared/transformers/normalize-cpf.transformer';
import { MoradiaDto } from './moradia.dto';

export class CreateAdotanteDto {
  @IsUUID()
  userId: string;

  @IsString()
  nomeCompleto: string;

  @IsDateString()
  dataNascimento: string;

  @NormalizeCpf()
  @IsCPF()
  cpf: string;

  @IsString()
  telefone: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @ValidateNested()
  @Type(() => MoradiaDto)
  moradia: MoradiaDto;
}
