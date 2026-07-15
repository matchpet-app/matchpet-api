import { Column } from 'typeorm';
import { UF } from '../enums/uf.enum';

export class Endereco {
  @Column()
  cep: string;

  @Column({ type: 'enum', enum: UF })
  uf: UF;

  @Column()
  cidade: string;

  @Column()
  bairro: string;

  @Column()
  logradouro: string;

  @Column()
  numero: string;

  @Column({ nullable: true })
  complemento?: string;
}
