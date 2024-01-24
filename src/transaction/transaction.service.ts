import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { MonnifyService } from 'src/services/monnify/monnify.service';
import { ConfigService } from '@nestjs/config';
import { WalletService } from 'src/wallet/wallet.service';
import { generateReference } from 'src/utils/misc';
import { ConfirmCreditQueryDto } from './dto/confirm-credit.dto';
import { TransactionActionEnum } from 'src/utils/constants';
// import { InitiateDebitDto } from './dto/initiate-debit.dto';

@Injectable()
export class TransactionService {
  constructor(
    private walletService: WalletService,
    private configService: ConfigService,
    private monnifyService: MonnifyService,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}

  async initiateDebitTransaction(createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletService.findOne(
      createTransactionDto.walletId,
    );
    const paymentReference = generateReference(wallet.store.name);
    const payload = {
      name: wallet.store.name,
      email: wallet.store.email,
      amount: createTransactionDto.amount,
      paymentReference: paymentReference,
      currency: 'NGN',
      paymentDescription: '',
    };

    const monnifyResponse =
      await this.monnifyService.initiateDebitTransaction(payload);
    await this.transactionModel.create({
      wallet: wallet,
      transactionType: TransactionActionEnum.MONNIFY_DEBIT,
      transactionReference: monnifyResponse.transactionReference,
      paymentReference: monnifyResponse.paymentReference,
      enabledPaymentMethod: JSON.stringify(
        monnifyResponse.enabledPaymentMethod,
      ),
      amount: createTransactionDto.amount,
      currency: payload.currency,
    });
    return monnifyResponse.checkoutUrl;
  }

  async confirmDebitTransaction(confirmCreditDto: ConfirmCreditQueryDto) {
    const transaction = await this.transactionModel.findOne({
      where: {
        paymentReference: confirmCreditDto.paymentReference,
      },
      relations: {
        wallet: true,
      },
    });
    const transactionDetails =
      await this.monnifyService.confirmDebitTransaction(
        transaction.transactionReference,
      );
    transaction.amountPaid = parseFloat(transactionDetails.amountPaid);
    transaction.totalPayable = parseFloat(transactionDetails.totalPayable);
    transaction.settlementAmount = transactionDetails.settlementAmount;
    transaction.paidOn = transactionDetails.paidOn;
    transaction.paymentStatus = transactionDetails.paymentStatus;
    transaction.paymentDescription = transactionDetails.paymentDescription;
    transaction.paymentMethod = transactionDetails.paymentMethod;
    transaction.product = JSON.stringify(transactionDetails.product || {});
    transaction.cardDetails = JSON.stringify(
      transactionDetails.cardDetails || {},
    );
    transaction.accountDetails = JSON.stringify(
      transactionDetails.accountDetails || {},
    );
    transaction.accountPayments = JSON.stringify(
      transactionDetails.accountPayments || [],
    );
    transaction.customer = JSON.stringify(transactionDetails.customer || {});
    transaction.metaData = JSON.stringify(transactionDetails.metaData || {});

    await transaction.save();

    if (transaction.paymentStatus === 'PAID') {
      await this.walletService.debitWallet(transaction.wallet._id as any, {
        amount: transaction.amount,
        description: transaction.paymentDescription,
        currency: transaction.currency,
        transactionReference: transaction.paymentReference,
      });
    }
  }

  // async credit(initiateCreditDto: InitiateDebitDto) {
  //   const wallet = await this.walletService.findOne(initiateCreditDto.walletId);

  //   if (initiateCreditDto.amount > wallet.balance) {
  //     throw new UnauthorizedException(
  //       'You do not have enough balance for this transaction',
  //     );
  //   }

  //   const paymentReference = generateReference(wallet.store.name);

  //   const monnifyResponse = await this.monnifyService.createCreditTransaction(
  //     paymentReference,
  //     initiateCreditDto.amount,
  //     {
  //       currency: 'NGN',
  //       destinationAccountName: initiateCreditDto.destinationAccountName,
  //       destinationAccountNumber: initiateCreditDto.destinationAccountNumber,
  //       destinationBankCode: initiateCreditDto.destinationBankCode,
  //       sourceAccountNumber: this.configService.get('MONNIFY_ACCOUNT_NO'),
  //     },
  //   );
  //   const transaction = await this.transactionModel.create({
  //     wallet: wallet,
  //     transactionType: TransactionActionEnum.MONNIFY_CREDIT,
  //     transactionReference: monnifyResponse.sessionId,
  //     paymentReference: monnifyResponse.reference,
  //     amount: initiateCreditDto.amount,
  //     currency: 'NGN',
  //     destinationAccountName: monnifyResponse.destinationAccountName,
  //     destinationBankName: monnifyResponse.destinationBankName,
  //     destinationAccountNumber: monnifyResponse.destinationAccountNumber,
  //     destinationBankCode: monnifyResponse.destinationBankCode,
  //   });

  //   if (monnifyResponse.status === 'SUCCESS') {
  //     await this.walletService.creditWallet(transaction.wallet.id, {
  //       amount: transaction.amount,
  //       description: transaction.paymentDescription || 'credited wallet',
  //       currency: transaction.currency,
  //       transactionReference: transaction.paymentReference,
  //     });
  //   }

  //   return {
  //     amount: transaction.amount,
  //     destinationAccountName: transaction.destinationAccountName,
  //     destinationBankName: transaction.destinationBankName,
  //     destinationAccountNumber: transaction.destinationAccountNumber,
  //   };
  // }
}
