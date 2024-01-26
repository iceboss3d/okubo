import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/Entities/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.wallet)
  user: User;
}
