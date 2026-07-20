import { IsInt, IsUrl, IsUUID, Min } from 'class-validator';

export class CreateFotosPetDto {
  @IsUUID()
  petId: string;

  @IsUrl()
  url: string;

  @IsInt()
  @Min(0)
  ordem: number;
}
