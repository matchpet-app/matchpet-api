import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAdotanteDto } from '../../adotantes/dto/create-adotante.dto';
import { CreateDoadorDto } from '../../doadores/dto/create-doador.dto';
import { AtLeastOneProfile } from '../validators/at-least-one-profile.validator';

export class CreateOnboardingDto {
  @ValidateNested()
  @Type(() => CreateAdotanteDto)
  @AtLeastOneProfile()
  adotante?: CreateAdotanteDto;

  @ValidateNested()
  @Type(() => CreateDoadorDto)
  doador?: CreateDoadorDto;
}
