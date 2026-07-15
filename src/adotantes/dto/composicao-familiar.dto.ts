import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { OutroPetDto } from './outro-pet.dto';

export class ComposicaoFamiliarDto {
  @IsInt()
  @Min(0)
  adultos: number;

  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  criancas: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutroPetDto)
  outrosPets: OutroPetDto[];
}
