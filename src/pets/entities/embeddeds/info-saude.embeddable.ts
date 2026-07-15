import { Column } from 'typeorm';

export class InfoSaude {
  @Column({ default: false })
  vacinado: boolean;

  @Column({ default: false })
  vermifugado: boolean;

  @Column({ default: false })
  castrado: boolean;

  @Column({ default: false })
  possuiDeficiencia: boolean;

  @Column({ nullable: true })
  descricaoDeficiencia?: string;

  @Column({ type: 'text', nullable: true })
  observacoesMedicas?: string;
}
