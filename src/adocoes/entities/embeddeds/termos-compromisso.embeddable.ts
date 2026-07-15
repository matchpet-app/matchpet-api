import { Column } from 'typeorm';

export class TermosCompromisso {
  @Column({ default: false })
  aceitouResponsabilidadeLongoPrazo: boolean;

  @Column({ default: false })
  aceitouTempoAdaptacao: boolean;

  @Column({ default: false })
  aceitouCustosVeterinarios: boolean;

  @Column({ type: 'timestamp' })
  aceitosEm: Date;

  @Column()
  versaoTermos: string;
}
