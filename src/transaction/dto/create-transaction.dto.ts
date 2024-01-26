import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { WalletDocument } from 'src/wallet/schemas/wallet.schema';

export class CreateCreditTransactionDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsObject()
  @IsNotEmptyObject()
  wallet: WalletDocument;

  @IsString()
  @IsOptional()
  description: string;
}
export class CreateDebitTransactionDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsObject()
  @IsNotEmptyObject()
  wallet: WalletDocument;

  @IsNumberString()
  @IsNotEmpty()
  bankCode: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10, 10)
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;
}
