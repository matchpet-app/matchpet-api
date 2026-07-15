import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class TermosCompromissoDto {
  @IsBoolean()
  aceitouResponsabilidadeLongoPrazo: boolean;

  @IsBoolean()
  aceitouTempoAdaptacao: boolean;

  @IsBoolean()
  aceitouCustosVeterinarios: boolean;

  @IsDateString()
  aceitosEm: string;

  @IsString()
  versaoTermos: string;
}
