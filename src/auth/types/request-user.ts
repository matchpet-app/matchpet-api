import type { Request } from 'express';
import { RoleUser } from '../../users/enums/role-user.enum';

export interface RequestUser {
  id: string;
  role: RoleUser | null;
}

export type AuthenticatedRequest = Request & { user?: RequestUser };
