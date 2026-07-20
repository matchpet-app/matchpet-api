import { IsUUID } from 'class-validator';

export class CreateFavoritoDto {
  @IsUUID()
  adotanteId: string;

  @IsUUID()
  petId: string;
}
