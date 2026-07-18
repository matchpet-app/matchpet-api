import { Transform, TransformFnParams } from 'class-transformer';
import { cpf } from 'cpf-cnpj-validator';

export function NormalizeCpf() {
  return Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? cpf.strip(value) : value;
  });
}
