import { IsUUID } from 'class-validator';

export class CreateFavoritoDto {
  @IsUUID()
  petId: string;
}
