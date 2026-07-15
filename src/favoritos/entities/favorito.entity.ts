import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Adotante } from '../../adotantes/entities/adotante.entity';
import { Pet } from '../../pets/entities/pet.entity';

@Entity('favoritos')
@Unique(['adotanteId', 'petId'])
export class Favorito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Adotante)
  @JoinColumn({ name: 'adotanteId' })
  adotante: Adotante;

  @Column()
  adotanteId: string;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column()
  petId: string;

  @CreateDateColumn()
  createdAt: Date;
}
