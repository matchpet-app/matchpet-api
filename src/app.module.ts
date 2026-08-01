import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdocoesModule } from './adocoes/adocoes.module';
import { AdocoesHistoricoModule } from './adocoes-historico/adocoes-historico.module';
import { AdotantesModule } from './adotantes/adotantes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DoadoresModule } from './doadores/doadores.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { FotosPetModule } from './fotos-pet/fotos-pet.module';
import { PetsModule } from './pets/pets.module';
import { validateEnv } from './shared/config/env.validation';
import { SnakeNamingStrategy } from './shared/database/snake-naming.strategy';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        migrations: ['dist/shared/database/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    AuthModule,
    UsersModule,
    AdotantesModule,
    DoadoresModule,
    PetsModule,
    FotosPetModule,
    AdocoesModule,
    FavoritosModule,
    AdocoesHistoricoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
