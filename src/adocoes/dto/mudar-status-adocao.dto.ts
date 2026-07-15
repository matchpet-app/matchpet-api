import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusAdocao } from '../enums/status-adocao.enum';

export class MudarStatusAdocaoDto {
  @IsEnum(StatusAdocao)
  novoStatus: StatusAdocao;

  @IsOptional()
  @IsString()
  observacao?: string;
}
