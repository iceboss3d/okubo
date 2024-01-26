import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../../wallet/Entities/wallet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  phone_number: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  @JoinColumn()
  wallet: Wallet;

  toResponseObject() {
    const {
      id,
      created_at,
      updated_at,
      email,
      first_name,
      last_name,
      phone_number,
    } = this;
    return {
      id,
      created_at,
      updated_at,
      email,
      first_name,
      last_name,
      phone_number,
    };
  }
}
