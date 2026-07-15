import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { RoleUser } from '../enums/role-user.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @ValidateIf((o: CreateUserDto) => !o.googleId)
  @IsString()
  @MinLength(8)
  password?: string;

  @ValidateIf((o: CreateUserDto) => !o.password)
  @IsString()
  googleId?: string;

  @IsEnum(RoleUser)
  role: RoleUser;
}
