import { Module } from '@nestjs/common';
import { AdocoesModule } from './adocoes/adocoes.module';
import { AdocoesHistoricoModule } from './adocoes-historico/adocoes-historico.module';
import { AdotantesModule } from './adotantes/adotantes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoadoresModule } from './doadores/doadores.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { FotosPetModule } from './fotos-pet/fotos-pet.module';
import { PetsModule } from './pets/pets.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
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
