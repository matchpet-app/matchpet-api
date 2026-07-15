import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Adocao } from '../../adocoes/entities/adocao.entity';
import { StatusAdocao } from '../../adocoes/enums/status-adocao.enum';
import { User } from '../../users/entities/user.entity';

@Entity('adocoes_historico')
export class AdocaoHistorico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Adocao,
    (adocao) => adocao.historico,
  )
  @JoinColumn({ name: 'adocaoId' })
  adocao: Adocao;

  @Column()
  adocaoId: string;

  @Column({ type: 'enum', enum: StatusAdocao, nullable: true })
  statusAnterior: StatusAdocao | null;

  @Column({ type: 'enum', enum: StatusAdocao })
  statusNovo: StatusAdocao;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'alteradoPorUserId' })
  alteradoPor?: User;

  @Column({ nullable: true })
  alteradoPorUserId: string | null;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @CreateDateColumn()
  createdAt: Date;
}
