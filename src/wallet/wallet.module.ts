import { Module, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './schemas/walletTransaction.schema';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Wallet.name,
        schema: WalletSchema,
      },
      {
        name: WalletTransaction.name,
        schema: WalletTransactionSchema,
      },
    ]),
    forwardRef(() => TransactionModule),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
