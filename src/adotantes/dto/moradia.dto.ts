import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { PosseMoradia } from '../enums/posse-moradia.enum';
import { StatusTelaProtecao } from '../enums/status-tela-protecao.enum';
import { TipoMoradia } from '../enums/tipo-moradia.enum';
import { ComposicaoFamiliarDto } from './composicao-familiar.dto';

export class MoradiaDto {
  @IsEnum(TipoMoradia)
  tipo: TipoMoradia;

  @IsEnum(PosseMoradia)
  posse: PosseMoradia;

  @IsEnum(StatusTelaProtecao)
  telaProtecao: StatusTelaProtecao;

  @ValidateNested()
  @Type(() => ComposicaoFamiliarDto)
  composicaoFamiliar: ComposicaoFamiliarDto;
}
