import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GoogleLoginDto } from './dto/google-login.dto';

const REFRESH_COOKIE_NAME = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.loginWithGoogle(dto.idToken);

    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    return { accessToken };
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const rawToken = this.extractRefreshCookie(req);

    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.refreshSession(rawToken);

    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    return { accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (rawToken) {
      await this.authService.logout(rawToken);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions());
  }

  private extractRefreshCookie(req: Request): string {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!rawToken) {
      throw new UnauthorizedException('Refresh token não informado');
    }
    return rawToken;
  }

  private setRefreshCookie(
    res: Response,
    token: string,
    expiresAt: Date,
  ): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      ...this.cookieOptions(),
      expires: expiresAt,
    });
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: this.configService.getOrThrow<string>('COOKIE_DOMAIN'),
      path: '/v1/auth',
    };
  }
}
