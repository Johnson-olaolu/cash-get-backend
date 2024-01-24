import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitiateDebitDto {
  @IsString() @IsNotEmpty() walletId: string;
  @IsNumber() amount: number;
  @IsString() @IsNotEmpty() destinationBankCode: string;
  @IsString() @IsNotEmpty() destinationAccountNumber: string;
  @IsString() @IsNotEmpty() destinationAccountName: string;
}
