import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Endereco } from '../../shared/embeddeds/endereco.embeddable';
import { User } from '../../users/entities/user.entity';
import { Moradia } from './embeddeds/moradia.embeddable';

@Entity('adotantes')
export class Adotante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  userId: string;

  @Column()
  nomeCompleto: string;

  @Column({ type: 'date' })
  dataNascimento: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  telefone: string;

  @Column(() => Endereco)
  endereco: Endereco;

  @Column(() => Moradia)
  moradia: Moradia;

  @Column({ default: false })
  verificado: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
