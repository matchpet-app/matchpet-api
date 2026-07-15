import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class InfoSaudeDto {
  @IsBoolean()
  vacinado: boolean;

  @IsBoolean()
  vermifugado: boolean;

  @IsBoolean()
  castrado: boolean;

  @IsBoolean()
  possuiDeficiencia: boolean;

  @ValidateIf((o: InfoSaudeDto) => o.possuiDeficiencia)
  @IsString()
  descricaoDeficiencia?: string;

  @IsOptional()
  @IsString()
  observacoesMedicas?: string;
}
