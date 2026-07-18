import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsCNPJ, IsCPF } from 'cpf-cnpj-validator/class-validator';
import { EnderecoDto } from '../../shared/dto/endereco.dto';
import { NormalizeCnpj } from '../../shared/transformers/normalize-cnpj.transformer';
import { NormalizeCpf } from '../../shared/transformers/normalize-cpf.transformer';
import { TipoDoador } from '../enums/tipo-doador.enum';

export class CreateDoadorDto {
  @IsUUID()
  userId: string;

  @IsEnum(TipoDoador)
  tipo: TipoDoador;

  @IsString()
  nomeExibicao: string;

  @ValidateIf((o: CreateDoadorDto) => o.tipo === TipoDoador.PESSOA_FISICA)
  @NormalizeCpf()
  @IsCPF()
  cpf?: string;

  @ValidateIf((o: CreateDoadorDto) => o.tipo === TipoDoador.ABRIGO_ONG)
  @NormalizeCnpj()
  @IsCNPJ()
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
