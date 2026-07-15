import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Endereco } from '../../shared/embeddeds/endereco.embeddable';
import { User } from '../../users/entities/user.entity';
import { TipoDoador } from '../enums/tipo-doador.enum';

@Entity('doadores')
export class Doador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  userId: string;

  @Column({ type: 'enum', enum: TipoDoador })
  tipo: TipoDoador;

  @Column()
  nomeExibicao: string;

  @Column({ nullable: true, unique: true })
  cpf?: string;

  @Column({ nullable: true, unique: true })
  cnpj?: string;

  @Column()
  telefone: string;

  @Column(() => Endereco)
  endereco: Endereco;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ default: false })
  verificado: boolean;

  @OneToMany(
    () => Pet,
    (pet) => pet.doador,
  )
  pets: Pet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
