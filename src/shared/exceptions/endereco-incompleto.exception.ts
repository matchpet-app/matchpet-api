import { BadRequestException } from '@nestjs/common';

export class EnderecoIncompletoException extends BadRequestException {
  constructor() {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message:
        'Endereço incompleto. Complete bairro, logradouro e número antes de continuar.',
      code: 'ENDERECO_INCOMPLETO',
    });
  }
}
