import { IsString } from 'class-validator';

export class CreateFavoritoDto {
  @IsString()
  adotanteId: string;

  @IsString()
  petId: string;
}
