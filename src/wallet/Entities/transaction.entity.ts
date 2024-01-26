import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TxType } from '../Enums/tx-type.enum';
import { Wallet } from './wallet.entity';

@Entity('trasactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  tx_type: TxType;

  @Column()
  amount: number;

  @Column({ unique: true })
  tx_ref: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
