import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity('fotos_pet')
export class FotosPet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Pet,
    (pet) => pet.fotos,
  )
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column()
  petId: string;

  @Column()
  url: string;

  @Column({ type: 'int', default: 0 })
  ordem: number;

  @CreateDateColumn()
  createdAt: Date;
}
