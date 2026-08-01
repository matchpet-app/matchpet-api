import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TokenService } from './token.service';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.googleClientId =
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async loginWithGoogle(idToken: string): Promise<SessionTokens> {
    const payload = await this.verifyGoogleIdToken(idToken);
    const user = await this.findOrCreateUser(payload.sub, payload.email);

    this.logger.log(`Login via Google bem-sucedido para userId=${user.id}`);

    const accessToken = this.tokenService.signAccessToken(user.id, user.role);
    const { token: refreshToken, expiresAt: refreshTokenExpiresAt } =
      await this.tokenService.issueRefreshToken(user.id);

    return { accessToken, refreshToken, refreshTokenExpiresAt };
  }

  async refreshSession(rawRefreshToken: string): Promise<SessionTokens> {
    const {
      userId,
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
    } = await this.tokenService.rotateRefreshToken(rawRefreshToken);

    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
    });
    const accessToken = this.tokenService.signAccessToken(user.id, user.role);

    return { accessToken, refreshToken, refreshTokenExpiresAt };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(rawRefreshToken);
  }

  private async verifyGoogleIdToken(
    idToken: string,
  ): Promise<{ sub: string; email: string }> {
    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      this.logger.warn('Falha ao verificar id_token do Google');
      throw new UnauthorizedException('Token do Google inválido');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Token do Google inválido');
    }
    if (!payload.email_verified) {
      throw new UnauthorizedException('Email do Google não verificado');
    }

    return { sub: payload.sub, email: payload.email };
  }

  private async findOrCreateUser(
    googleId: string,
    email: string,
  ): Promise<User> {
    const byGoogleId = await this.usersRepository.findOne({
      where: { googleId },
    });
    if (byGoogleId) {
      return byGoogleId;
    }

    const byEmail = await this.usersRepository.findOne({ where: { email } });
    if (byEmail) {
      byEmail.googleId = googleId;
      return this.usersRepository.save(byEmail);
    }

    const newUser = this.usersRepository.create({
      email,
      googleId,
      role: null,
    });
    return this.usersRepository.save(newUser);
  }
}
