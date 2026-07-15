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
import { Doador } from '../../doadores/entities/doador.entity';
import { FotosPet } from '../../fotos-pet/entities/fotos-pet.entity';
import { Especie } from '../enums/especie.enum';
import { NivelEnergia } from '../enums/nivel-energia.enum';
import { Porte } from '../enums/porte.enum';
import { Sexo } from '../enums/sexo.enum';
import { StatusPet } from '../enums/status-pet.enum';
import { Compatibilidade } from './embeddeds/compatibilidade.embeddable';
import { InfoSaude } from './embeddeds/info-saude.embeddable';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Doador,
    (doador) => doador.pets,
  )
  @JoinColumn()
  doador: Doador;

  @Column()
  doadorId: string;

  @Column()
  nome: string;

  @Column({ type: 'enum', enum: Especie })
  especie: Especie;

  @Column({ nullable: true })
  raca?: string;

  @Column({ type: 'date', nullable: true })
  dataNascimentoEstimada?: string;

  @Column({ nullable: true })
  idadeAproximadaMeses?: number;

  @Column({ type: 'enum', enum: Porte })
  porte: Porte;

  @Column({ type: 'enum', enum: Sexo })
  sexo: Sexo;

  @Column({ nullable: true })
  corPredominante?: string;

  @Column({ type: 'enum', enum: NivelEnergia })
  nivelEnergia: NivelEnergia;

  @Column({ type: 'text' })
  descricao: string;

  @Column(() => InfoSaude)
  saude: InfoSaude;

  @Column(() => Compatibilidade)
  compatibilidade: Compatibilidade;

  @OneToMany(
    () => FotosPet,
    (foto) => foto.pet,
  )
  fotos: FotosPet[];

  @Column({ type: 'enum', enum: StatusPet, default: StatusPet.DISPONIVEL })
  status: StatusPet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
