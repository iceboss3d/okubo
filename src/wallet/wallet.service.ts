import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Wallet } from './Entities/wallet.entity';
import { TxType } from './Enums/tx-type.enum';
import { TransactionDTO } from './DTOs/wallet.dto';
import { Transaction } from './Entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(private readonly dataSource: DataSource) {}

  async getWalletBalance(wallet_id: string) {
    const wallet = await this.dataSource.getRepository(Wallet).findOne({
      where: {
        id: wallet_id,
      },
      relations: ['transactions'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const totalCreditTransactions = wallet.transactions
      .filter((trx) => trx.tx_type === TxType.CREDIT)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const totalDebitTransactions = wallet.transactions
      .filter((trx) => trx.tx_type === TxType.DEBIT)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const walletBalance = totalCreditTransactions - totalDebitTransactions;

    return walletBalance;
  }

  async creditWallet(wallet_id: string, data: TransactionDTO) {
    const wallet = await this.dataSource.getRepository(Wallet).findOne({
      where: {
        id: wallet_id,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const transaction = this.dataSource.getRepository(Transaction).create({
      wallet,
      amount: data.amount,
      tx_ref: String(new Date().getTime()),
      tx_type: TxType.CREDIT,
    });
    await this.dataSource.getRepository(Transaction).save(transaction);

    return {
      message: 'Transaction created',
      data: transaction,
    };
  }

  async debitWallet(wallet_id: string, data: TransactionDTO) {
    const wallet = await this.dataSource.getRepository(Wallet).findOne({
      where: {
        id: wallet_id,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const walletBalance = await this.getWalletBalance(wallet_id);

    if (data.amount > walletBalance) {
      throw new UnprocessableEntityException('Insufficient funds');
    }

    const transaction = this.dataSource.getRepository(Transaction).create({
      wallet,
      amount: data.amount,
      tx_ref: String(new Date().getTime()),
      tx_type: TxType.DEBIT,
    });

    await this.dataSource.getRepository(Transaction).save(transaction);

    return {
      message: 'Transaction created',
      data: transaction,
    };
  }
}
