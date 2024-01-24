import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString() @IsNotEmpty() walletId: string;
  @IsNumber() amount: number;
}
