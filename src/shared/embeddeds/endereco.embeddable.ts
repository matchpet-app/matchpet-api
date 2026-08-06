import { Column } from 'typeorm';
import { UF } from '../enums/uf.enum';

export class Endereco {
  @Column()
  cep: string;

  @Column({ type: 'enum', enum: UF })
  uf: UF;

  @Column()
  cidade: string;

  @Column({ nullable: true })
  bairro?: string;

  @Column({ nullable: true })
  logradouro?: string;

  @Column({ nullable: true })
  numero?: string;

  @Column({ nullable: true })
  complemento?: string;

  isCompleto(): boolean {
    return Boolean(this.bairro && this.logradouro && this.numero);
  }
}
