import { Module } from '@nestjs/common';
import { AdotantesModule } from '../adotantes/adotantes.module';
import { DoadoresModule } from '../doadores/doadores.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [AdotantesModule, DoadoresModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
