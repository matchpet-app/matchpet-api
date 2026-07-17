import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EnderecoDto } from '../../shared/dto/endereco.dto';
import { TipoDoador } from '../enums/tipo-doador.enum';

export class CreateDoadorDto {
  @IsUUID()
  userId: string;

  @IsEnum(TipoDoador)
  tipo: TipoDoador;

  @IsString()
  nomeExibicao: string;

  @ValidateIf((o: CreateDoadorDto) => o.tipo === TipoDoador.PESSOA_FISICA)
  @IsString()
  cpf?: string;

  @ValidateIf((o: CreateDoadorDto) => o.tipo === TipoDoador.ABRIGO_ONG)
  @IsString()
  cnpj?: string;

  @IsString()
  telefone: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @IsOptional()
  @IsString()
  descricao?: string;
}
