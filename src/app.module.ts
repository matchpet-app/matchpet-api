import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdocoesModule } from './adocoes/adocoes.module';
import { AdocoesHistoricoModule } from './adocoes-historico/adocoes-historico.module';
import { AdotantesModule } from './adotantes/adotantes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoadoresModule } from './doadores/doadores.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { FotosPetModule } from './fotos-pet/fotos-pet.module';
import { PetsModule } from './pets/pets.module';
import { SnakeNamingStrategy } from './shared/database/snake-naming.strategy';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [AppService],
})
export class AppModule {}
