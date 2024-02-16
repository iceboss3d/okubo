import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ChargeFrom } from './card.interface';

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

export class DepositDTO {
  @IsUUID()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  wallet_id: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(5000)
  amount: number;

  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ChargeFrom)
  charge_from: ChargeFrom;

  @IsString()
  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  card_id: string;
}

export class ReferenceDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  reference: string;
}
