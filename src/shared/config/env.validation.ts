import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @MinLength(32, {
    message: 'JWT_SECRET deve ter pelo menos 32 caracteres',
  })
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty({ message: 'GOOGLE_CLIENT_ID é obrigatório' })
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty({ message: 'COOKIE_DOMAIN é obrigatório' })
  COOKIE_DOMAIN: string;

  @IsString()
  @IsNotEmpty({ message: 'CORS_ORIGIN é obrigatório' })
  CORS_ORIGIN: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(
      `Configuração de ambiente inválida:\n${messages.join('\n')}`,
    );
  }

  return config;
}
