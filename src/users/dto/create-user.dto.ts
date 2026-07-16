import { IsEmail, IsIn, IsString, MinLength, ValidateIf } from 'class-validator';
import { RoleUser } from '../enums/role-user.enum';

const PUBLIC_ROLES = Object.values(RoleUser).filter(
  (role) => role !== RoleUser.ADMIN,
);

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

  @IsIn(PUBLIC_ROLES)
  role: RoleUser;
}
