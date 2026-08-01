import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import type { RequestUser } from './types/request-user';

interface AccessTokenPayload {
  sub: string;
  role: RequestUser['role'];
}

interface IssuedRefreshToken {
  token: string;
  expiresAt: Date;
}

interface RotatedRefreshToken extends IssuedRefreshToken {
  userId: string;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly refreshTtlMs: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {
    const ttlDays = this.configService.get<number>(
      'REFRESH_TOKEN_TTL_DAYS',
      14,
    );
    this.refreshTtlMs = ttlDays * 24 * 60 * 60 * 1000;
  }

  signAccessToken(userId: string, role: RequestUser['role']): string {
    const payload: AccessTokenPayload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }

  async issueRefreshToken(userId: string): Promise<IssuedRefreshToken> {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);

    const refreshToken = this.refreshTokensRepository.create({
      userId,
      secretHash: this.hash(token),
      expiresAt,
      revokedAt: null,
    });
    await this.refreshTokensRepository.save(refreshToken);

    return { token, expiresAt };
  }

  async rotateRefreshToken(rawToken: string): Promise<RotatedRefreshToken> {
    const current = await this.refreshTokensRepository.findOne({
      where: { secretHash: this.hash(rawToken) },
    });

    if (!current) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (current.revokedAt) {
      this.logger.warn(
        `Reuso de refresh token detectado para userId=${current.userId} — revogando todas as sessões`,
      );
      await this.revokeAllForUser(current.userId);
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (current.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    current.revokedAt = new Date();
    await this.refreshTokensRepository.save(current);

    const issued = await this.issueRefreshToken(current.userId);
    this.logger.log(`Refresh token rotacionado para userId=${current.userId}`);

    return { userId: current.userId, ...issued };
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const current = await this.refreshTokensRepository.findOne({
      where: { secretHash: this.hash(rawToken) },
    });
    if (current && !current.revokedAt) {
      current.revokedAt = new Date();
      await this.refreshTokensRepository.save(current);
      this.logger.log(`Logout: refresh token revogado para userId=${current.userId}`);
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokensRepository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private hash(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
