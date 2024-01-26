import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class WalletIdDTO {
  @IsUUID()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  wallet_id: string;
}

export class TransactionDTO {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(100)
  amount: number;
}
