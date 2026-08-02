import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AdotantesService } from '../adotantes/adotantes.service';
import { Adotante } from '../adotantes/entities/adotante.entity';
import { DoadoresService } from '../doadores/doadores.service';
import { Doador } from '../doadores/entities/doador.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

export interface OnboardingResult {
  adotante?: Adotante;
  doador?: Doador;
}

@Injectable()
export class OnboardingService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly adotantesService: AdotantesService,
    private readonly doadoresService: DoadoresService,
  ) {}

  async create(
    userId: string,
    dto: CreateOnboardingDto,
  ): Promise<OnboardingResult> {
    return this.dataSource.transaction(async (manager) => {
      const existingRoles = await manager.count(UserRole, {
        where: { userId },
      });
      if (existingRoles > 0) {
        throw new ConflictException('Este usuário já concluiu o onboarding');
      }

      const result: OnboardingResult = {};

      if (dto.adotante) {
        result.adotante = await this.adotantesService.createWithManager(
          manager,
          userId,
          dto.adotante,
        );
      }

      if (dto.doador) {
        result.doador = await this.doadoresService.createWithManager(
          manager,
          userId,
          dto.doador,
        );
      }

      return result;
    });
  }
}
