import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { MonnifyService } from 'src/services/monnify/monnify.service';
import { CreateCreditTransactionDto } from './dto/create-transaction.dto';
import {
  TransactionProgressEnum,
  TransactionTypeEnum,
} from 'src/utils/constants';
import { WalletService } from 'src/wallet/wallet.service';
import { MonnifyTransactionStatuses } from 'src/services/monnify/types';
import { TransactionGateway } from './transaction.gateway';

@Injectable()
export class TransactionService {
  constructor(
    private monnifyService: MonnifyService,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
    private transactionGateway: TransactionGateway,
  ) {}

  async findOne(id: string) {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('wallet');
    if (!transaction) {
      throw new NotFoundException(`Transaction not found for this id ${id}`);
    }
    return transaction;
  }

  async findOneByReference(ref: string) {
    const transaction = await this.transactionModel
      .findOne({
        transactionReference: ref,
      })
      .populate('wallet');
    if (!transaction) {
      throw new NotFoundException(`Transaction not found for this ref ${ref}`);
    }
    return transaction;
  }

  async createCreditTransaction(
    createTransactionDto: CreateCreditTransactionDto,
  ) {
    const response = await this.monnifyService.initiateCreditTransaction({
      amount: createTransactionDto.amount,
      email: createTransactionDto.wallet.store.email,
      name: createTransactionDto.wallet.store.name,
      paymentDescription: createTransactionDto.description,
      paymentReference: createTransactionDto.reference,
    });
    const transaction = await this.transactionModel.create({
      externalTransactionId: response.transactionReference,
      transactionUrl: response.checkoutUrl,
      wallet: createTransactionDto.wallet,
      transactionType: TransactionTypeEnum.CREDIT,
      transactionReference: createTransactionDto.reference,
      amount: createTransactionDto.amount,
      description: createTransactionDto.description,
    });
    return transaction;
  }

  async confirmCreditTransaction(transactionReference: string) {
    const transaction = await this.findOneByReference(transactionReference);
    const response = await this.monnifyService.confirmCreditTransaction(
      transaction.externalTransactionId,
    );
    transaction.progress = TransactionProgressEnum.COMPLETED;
    transaction.status = response.paymentStatus;
    if (transaction.status === MonnifyTransactionStatuses.PAID) {
      await this.walletService.creditWallet(transaction.wallet.id, transaction);
    }
    await transaction.save();
    this.transactionGateway.confirmTransfer(transaction.id, transaction);
    return true;
  }
}
