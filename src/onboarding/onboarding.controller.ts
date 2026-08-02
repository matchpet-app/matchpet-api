import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/types/request-user';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { OnboardingResult, OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateOnboardingDto,
  ): Promise<OnboardingResult> {
    return this.onboardingService.create(user.id, dto);
  }
}
