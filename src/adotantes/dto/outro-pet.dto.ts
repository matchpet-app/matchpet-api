import { IsInt, IsString, Min } from 'class-validator';

export class OutroPetDto {
  @IsString()
  especie: string;

  @IsInt()
  @Min(1)
  quantidade: number;
}
