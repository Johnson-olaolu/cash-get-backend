import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/confirm-credit')
  async confirmCredit(@Query('paymentReference') paymentReference: string) {
    console.log(paymentReference);
    return await this.transactionService.confirmCreditTransaction(
      paymentReference,
    );
  }
}
