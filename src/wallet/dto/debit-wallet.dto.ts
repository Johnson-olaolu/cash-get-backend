import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DebitWalletDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
