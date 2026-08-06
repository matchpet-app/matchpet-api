import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UF } from '../shared/enums/uf.enum';
import { normalizarCep, validarCep } from '../shared/utils/cep.util';
import { CepResult, ViaCepResponse } from './cep.types';

@Injectable()
export class CepService {
  async buscar(cep: string): Promise<CepResult> {
    const cepNormalizado = normalizarCep(cep);
    if (!validarCep(cepNormalizado)) {
      throw new BadRequestException('CEP deve conter 8 dígitos');
    }

    let response: Response;
    try {
      response = await fetch(
        `https://viacep.com.br/ws/${cepNormalizado}/json/`,
      );
    } catch {
      throw new ServiceUnavailableException(
        'Não foi possível consultar o CEP no momento',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Não foi possível consultar o CEP no momento',
      );
    }

    const data = (await response.json()) as ViaCepResponse;
    if (data.erro) {
      throw new NotFoundException(`CEP ${cep} não encontrado`);
    }

    return {
      cep: data.cep,
      uf: data.uf as UF,
      cidade: data.localidade,
      bairro: data.bairro || undefined,
      logradouro: data.logradouro || undefined,
    };
  }
}
