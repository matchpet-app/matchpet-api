export function normalizarCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

export function validarCep(cep: string): boolean {
  return /^\d{8}$/.test(cep);
}
