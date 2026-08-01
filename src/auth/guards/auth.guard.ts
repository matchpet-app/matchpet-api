import {
  CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { RoleUser } from '../../users/enums/role-user.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { AuthenticatedRequest, RequestUser } from '../types/request-user';

interface AccessTokenPayload {
  sub: string;
  role: RequestUser['role'];
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token de acesso não informado');
    }

    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        algorithms: ['HS256'],
        ignoreExpiration: false,
      });
      request.user = this.toRequestUser(payload);
      return true;
    } catch {
      throw new UnauthorizedException('Token de acesso inválido ou expirado');
    }
  }

  private toRequestUser(payload: AccessTokenPayload): RequestUser {
    const isValidRole =
      payload.role === null || Object.values(RoleUser).includes(payload.role);
    if (typeof payload.sub !== 'string' || !payload.sub || !isValidRole) {
      throw new UnauthorizedException('Token de acesso inválido ou expirado');
    }
    return { id: payload.sub, role: payload.role };
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
