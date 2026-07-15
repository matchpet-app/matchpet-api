import { IsInt, IsString, IsUrl, Min } from 'class-validator';

export class CreateFotosPetDto {
  @IsString()
  petId: string;

  @IsUrl()
  url: string;

  @IsInt()
  @Min(0)
  ordem: number;
}
