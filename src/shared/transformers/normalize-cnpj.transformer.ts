import { Transform, TransformFnParams } from 'class-transformer';
import { cnpj } from 'cpf-cnpj-validator';

export function NormalizeCnpj() {
  return Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? cnpj.strip(value) : value;
  });
}
