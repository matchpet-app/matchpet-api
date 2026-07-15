import { Column } from 'typeorm';
import { RespostaCompatibilidade } from '../../enums/resposta-compatibilidade.enum';

export class Compatibilidade {
  @Column({
    type: 'enum',
    enum: RespostaCompatibilidade,
    default: RespostaCompatibilidade.NAO_TESTADO,
  })
  conviveComCriancas: RespostaCompatibilidade;

  @Column({
    type: 'enum',
    enum: RespostaCompatibilidade,
    default: RespostaCompatibilidade.NAO_TESTADO,
  })
  conviveComOutrosPets: RespostaCompatibilidade;

  @Column({
    type: 'enum',
    enum: RespostaCompatibilidade,
    default: RespostaCompatibilidade.NAO_TESTADO,
  })
  conviveComGatos: RespostaCompatibilidade;
}
