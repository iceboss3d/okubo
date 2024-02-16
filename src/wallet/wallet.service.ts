import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Wallet } from './Entities/wallet.entity';
import { TxType } from './Enums/tx-type.enum';
import { DepositDTO, ReferenceDTO, TransactionDTO } from './DTOs/wallet.dto';
import { Transaction } from './Entities/transaction.entity';
import { CustomHttpService } from 'src/custom-http/custom-http.service';
import {
  ChargeFrom,
  IPaystackInitPayload,
  IPaystackInitResponse,
  IPaystackVerifyResponse,
} from './DTOs/card.interface';
import { Card } from './Entities/card.entity';
import { UserIdDTO } from 'src/user/DTOs/user.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly customHttpService: CustomHttpService,
  ) {}

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

  async initDeposit(data: DepositDTO) {
    const wallet = await this.dataSource.getRepository(Wallet).findOne({
      where: {
        id: data.wallet_id,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const payload: IPaystackInitPayload = {
      amount: data.amount,
      email: data.email,
      channels: ['card'],
      callback_url: 'http://localhost:8000',
      metadata: {
        wallet_id: data.wallet_id,
      },
    };

    if (data.charge_from === ChargeFrom.SAVED_CARD) {
      if (!data.card_id) {
        throw new UnprocessableEntityException('Card Id is required');
      }

      const card = await this.dataSource.getRepository(Card).findOne({
        where: {
          id: data.card_id,
        },
      });

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return await this.chargeAuthorization({
        ...payload,
        authorization_code: card.authorization_code,
      });
    } else {
      return await this.initiateNewCardTransaction(payload);
    }
  }

  private async initiateNewCardTransaction(payload: IPaystackInitPayload) {
    const response = await this.customHttpService.paystackHttpService<
      IPaystackInitResponse,
      typeof payload
    >('post', '/transaction/initialize', payload);

    if (!response.status) {
      throw new UnprocessableEntityException(response.message);
    }

    return {
      message: 'Deposit Link Generated',
      paymentLink: response.data.authorization_url,
    };
  }

  private async chargeAuthorization(payload: IPaystackInitPayload) {
    const response = await this.customHttpService.paystackHttpService<
      IPaystackVerifyResponse,
      typeof payload
    >('post', '/transaction/charge_authorization', payload);

    if (!response.status) {
      throw new UnprocessableEntityException(response.message);
    }

    if (response.data.status !== 'success') {
      throw new UnprocessableEntityException(response.message);
    }

    await this.creditWallet(payload.metadata.wallet_id, {
      amount: payload.amount,
    });

    return {
      message: 'Deposit Successful',
      paymentLink: '',
    };
  }

  async verifyTransaction(referenceDTO: ReferenceDTO) {
    const transaction =
      await this.customHttpService.paystackHttpService<IPaystackVerifyResponse>(
        'get',
        `/transaction/verify/${referenceDTO.reference}`,
      );

    if (transaction.data.status !== 'success') {
      throw new BadRequestException('Payment Unsuccessful');
    }

    const wallet = await this.dataSource.getRepository(Wallet).findOne({
      where: {
        id: transaction.data.metadata.wallet_id,
      },
      relations: ['user'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    await this.creditWallet(transaction.data.metadata.wallet_id, {
      amount: transaction.data.amount,
    });

    if (transaction.data.authorization.reusable) {
      const card = this.dataSource
        .getRepository(Card)
        .create(transaction.data.authorization);

      card.user = wallet.user;
      await this.dataSource.getRepository(Card).save(card);
    }
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

  async getCards(userIdDto: UserIdDTO) {
    const cards = await this.dataSource.getRepository(Card).find({
      where: {
        user: {
          id: userIdDto.user_id,
        },
      },
    });

    return cards;
  }
}
