import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Especie } from '../enums/especie.enum';
import { NivelEnergia } from '../enums/nivel-energia.enum';
import { Porte } from '../enums/porte.enum';
import { Sexo } from '../enums/sexo.enum';
import { CompatibilidadeDto } from './compatibilidade.dto';
import { InfoSaudeDto } from './info-saude.dto';

export class CreatePetDto {
  @IsString()
  doadorId: string;

  @IsString()
  nome: string;

  @IsEnum(Especie)
  especie: Especie;

  @IsOptional()
  @IsString()
  raca?: string;

  @IsOptional()
  @IsDateString()
  dataNascimentoEstimada?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  idadeAproximadaMeses?: number;

  @IsEnum(Porte)
  porte: Porte;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsString()
  corPredominante?: string;

  @IsEnum(NivelEnergia)
  nivelEnergia: NivelEnergia;

  @IsString()
  descricao: string;

  @ValidateNested()
  @Type(() => InfoSaudeDto)
  saude: InfoSaudeDto;

  @ValidateNested()
  @Type(() => CompatibilidadeDto)
  compatibilidade: CompatibilidadeDto;
}
