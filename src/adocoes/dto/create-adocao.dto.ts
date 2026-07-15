import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApoioCuidado } from '../enums/apoio-cuidado.enum';
import { LocalPet } from '../enums/local-pet.enum';
import { TermosCompromissoDto } from './termos-compromisso.dto';

export class CreateAdocaoDto {
  @IsString()
  petId: string;

  @IsString()
  adotanteId: string;

  @IsEnum(LocalPet)
  ondeFicaraDia: LocalPet;

  @IsEnum(LocalPet)
  ondeFicaraNoite: LocalPet;

  @IsEnum(ApoioCuidado)
  possuiApoioCuidado: ApoioCuidado;

  @ValidateNested()
  @Type(() => TermosCompromissoDto)
  termos: TermosCompromissoDto;

  @IsOptional()
  @IsString()
  observacoesAdotante?: string;
}
