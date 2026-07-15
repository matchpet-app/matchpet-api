import { IsEnum } from 'class-validator';
import { RespostaCompatibilidade } from '../enums/resposta-compatibilidade.enum';

export class CompatibilidadeDto {
  @IsEnum(RespostaCompatibilidade)
  conviveComCriancas: RespostaCompatibilidade;

  @IsEnum(RespostaCompatibilidade)
  conviveComOutrosPets: RespostaCompatibilidade;

  @IsEnum(RespostaCompatibilidade)
  conviveComGatos: RespostaCompatibilidade;
}
