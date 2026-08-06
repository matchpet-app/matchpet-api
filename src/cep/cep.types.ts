import { UF } from 'src/shared/enums/uf.enum';

export interface CepResult {
  cep: string;
  uf: UF;
  cidade: string;
  bairro?: string;
  logradouro?: string;
}

export interface ViaCepResponse {
  erro?: boolean;
  cep: string;
  uf: string;
  localidade: string;
  bairro: string;
  logradouro: string;
}
