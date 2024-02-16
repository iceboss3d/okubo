import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  DepositDTO,
  ReferenceDTO,
  TransactionDTO,
  WalletIdDTO,
} from './DTOs/wallet.dto';
import { UserIdDTO } from 'src/user/DTOs/user.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get(':wallet_id/balance')
  async getWalletBalance(@Param() param: WalletIdDTO) {
    return await this.walletService.getWalletBalance(param.wallet_id);
  }

  @Post(':wallet_id/credit')
  async creditWallet(
    @Param() param: WalletIdDTO,
    @Body() data: TransactionDTO,
  ) {
    return await this.walletService.creditWallet(param.wallet_id, data);
  }

  @Post(':wallet_id/debit')
  async debitWallet(@Param() param: WalletIdDTO, @Body() data: TransactionDTO) {
    return await this.walletService.debitWallet(param.wallet_id, data);
  }

  @Post('initiate-deposit')
  async initiateDeposit(@Body() data: DepositDTO) {
    return await this.walletService.initDeposit(data);
  }

  @Get('verify-transaction/:reference')
  async verifyTransaction(@Param() params: ReferenceDTO) {
    return await this.walletService.verifyTransaction(params);
  }

  @Get('cards/:user_id')
  async getCards(@Param() data: UserIdDTO) {
    return await this.walletService.getCards(data);
  }
}
