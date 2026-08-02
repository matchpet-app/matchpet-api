import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { RoleUser } from '../enums/role-user.enum';
import { User } from './user.entity';

@Entity('user_roles')
export class UserRole {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  userId: string;

  @PrimaryColumn({ type: 'enum', enum: RoleUser })
  role: RoleUser;

  @CreateDateColumn()
  createdAt: Date;
}
