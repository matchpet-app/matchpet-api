import { Column } from 'typeorm';
import type { OutroPet } from './outro-pet.interface';

export class ComposicaoFamiliar {
  @Column({ type: 'int', default: 0 })
  adultos: number;

  @Column({ type: 'jsonb', default: [] })
  criancas: number[];

  @Column({ type: 'jsonb', default: [] })
  outrosPets: OutroPet[];
}
