import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdocaoHistorico } from '../../adocoes-historico/entities/adocao-historico.entity';
import { Adotante } from '../../adotantes/entities/adotante.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { ApoioCuidado } from '../enums/apoio-cuidado.enum';
import { LocalPet } from '../enums/local-pet.enum';
import { StatusAdocao } from '../enums/status-adocao.enum';
import { TermosCompromisso } from './embeddeds/termos-compromisso.embeddable';

@Entity('adocoes')
export class Adocao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pet)
  @JoinColumn()
  pet: Pet;

  @Column()
  petId: string;

  @ManyToOne(() => Adotante)
  @JoinColumn()
  adotante: Adotante;

  @Column()
  adotanteId: string;

  @Column({ type: 'enum', enum: StatusAdocao, default: StatusAdocao.PENDENTE })
  status: StatusAdocao;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao?: Date;

  @Column({ type: 'enum', enum: LocalPet })
  ondeFicaraDia: LocalPet;

  @Column({ type: 'enum', enum: LocalPet })
  ondeFicaraNoite: LocalPet;

  @Column({ type: 'enum', enum: ApoioCuidado })
  possuiApoioCuidado: ApoioCuidado;

  @Column({ type: 'text', nullable: true })
  observacoesAdotante?: string;

  @Column(() => TermosCompromisso)
  termos: TermosCompromisso;

  @OneToMany(
    () => AdocaoHistorico,
    (historico) => historico.adocao,
  )
  historico: AdocaoHistorico[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
