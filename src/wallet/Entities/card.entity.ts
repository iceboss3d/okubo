import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/Entities/user.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  authorization_code: string;

  @Column()
  bin: string;

  @Column()
  last4: string;

  @Column()
  card_type: string;

  @Column()
  brand: string;

  @Column()
  exp_month: string;

  @Column()
  exp_year: string;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
