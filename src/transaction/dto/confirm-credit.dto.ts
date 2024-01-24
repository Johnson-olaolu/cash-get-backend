import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmCreditQueryDto {
  @IsString() @IsNotEmpty() paymentReference: string;
}
