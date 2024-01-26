import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class DebitWalletDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  accountNo: string;

  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;
}
