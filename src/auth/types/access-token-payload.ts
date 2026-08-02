import type { RoleUser } from '../../users/enums/role-user.enum';

export interface AccessTokenPayload {
  sub: string;
  roles: RoleUser[];
}
