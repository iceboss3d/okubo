import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { CustomHttpModule } from 'src/custom-http/custom-http.module';

@Module({
  imports: [CustomHttpModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
