import { Type } from 'class-transformer';
import { IsDateString, IsString, ValidateNested } from 'class-validator';
import { EnderecoDto } from '../../shared/dto/endereco.dto';
import { MoradiaDto } from './moradia.dto';

export class CreateAdotanteDto {
  @IsString()
  userId: string;

  @IsString()
  nomeCompleto: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  telefone: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @ValidateNested()
  @Type(() => MoradiaDto)
  moradia: MoradiaDto;
}
