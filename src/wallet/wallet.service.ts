import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './schemas/wallet.schema';
import { Model } from 'mongoose';
import { WalletTransaction } from './schemas/walletTransaction.schema';
import {
  TransactionActionEnum,
  TransactionStatusEnum,
  TransactionTypeEnum,
  WalletTransactionActionEnum,
} from 'src/utils/constants';
import { generateReference } from 'src/utils/misc';
import { StoreDocument } from 'src/store/schemas/store.schema';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionDocument } from 'src/transaction/schemas/transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}
  async create(store: StoreDocument) {
    const wallet = await this.walletModel.create({
      store: store,
    });
    return wallet;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  async findOne(id: string) {
    const wallet = await this.walletModel.findById(id).populate('store');
    if (!wallet) {
      throw new NotFoundException('No Wallet found for this id');
    }
    return wallet;
  }

  async fetchStoreWallet(storeId: string) {
    const wallet = await this.walletModel
      .findOne({ store: storeId })
      .populate('store');
    if (!wallet) {
      throw new NotFoundException('No Wallet found for this id');
    }
    return wallet;
  }

  async initiateCreditWallet(
    walletId: string,
    creditWalletDto: CreditWalletDto,
  ) {
    const wallet = await this.findOne(walletId);
    const response = await this.transactionService.createCreditTransaction({
      amount: creditWalletDto.amount,
      description: creditWalletDto.description,
      reference: generateReference(wallet.store.name),
      wallet: wallet,
    });
    return response;
  }

  async debitWallet(
    walletId: string,
    payload: {
      amount: number;
      description: string;
      currency: string;
      transactionReference: string;
    },
  ) {
    const wallet = await this.findOne(walletId);
    await this.walletTransactionModel.create({
      wallet: wallet,
      currBalance: wallet.balance + payload.amount,
      prevBalance: wallet.balance,
      transactionReference: payload.transactionReference,
      description: payload.description,
      amount: payload.amount,
      currency: payload.currency,
      transactionType: TransactionActionEnum.MONNIFY_DEBIT,
      transactionStatus: TransactionStatusEnum.CONFIRMED,
    });

    wallet.balance = wallet.balance + payload.amount;
    wallet.ledgerBalance = wallet.ledgerBalance + payload.amount;
    wallet.save();
    return;
  }

  async creditWallet(walletId: string, transaction: TransactionDocument) {
    const wallet = await this.findOne(walletId);
    await this.walletTransactionModel.create({
      wallet: wallet,
      currBalance: wallet.balance - transaction.amount,
      prevBalance: wallet.balance,
      transactionReference: transaction.transactionReference,
      description: transaction.description,
      amount: transaction.amount,
      currency: transaction.currency,
      action: WalletTransactionActionEnum.DEPOSIT,
      type: TransactionTypeEnum.CREDIT,
      transactionStatus: TransactionStatusEnum.CONFIRMED,
    });

    wallet.balance = wallet.balance - transaction.amount;
    wallet.ledgerBalance = wallet.ledgerBalance - transaction.amount;
    wallet.save();

    // Debit wallet notification
    // await this.mailService.sendDebitConfirmedMail(wallet.user, {
    //   currency: payload.currency,
    //   amount: payload.amount,
    // });
    return wallet;
  }

  async initiateEscrowCredit(
    walletId: string,
    payload: { amount: number; currency: string },
  ) {
    const wallet = await this.findOne(walletId);

    if (payload.amount > wallet.balance) {
      throw new ForbiddenException('Wallet can not fund this order');
    }
    const transactionReference = generateReference(
      (wallet.store as StoreDocument).name,
    );
    const walletTransaction = await this.walletTransactionModel.create({
      wallet: wallet,
      currBalance: wallet.balance - payload.amount,
      prevBalance: wallet.balance,
      transactionReference: transactionReference,
      description: 'initiate escrow credit',
      amount: payload.amount,
      currency: payload.currency,
      transactionType: TransactionActionEnum.ESCROW_CREDIT,
      transactionStatus: TransactionStatusEnum.INITIATED,
    });
    wallet.balance = wallet.balance - payload.amount;
    await wallet.save();
    return walletTransaction;
  }

  async confirmEscrowCredit(transactionReference: string) {
    const walletTransaction = await this.walletTransactionModel.findOne({
      where: {
        transactionReference: transactionReference,
      },
      relations: {
        wallet: true,
      },
    });
    if (
      walletTransaction.transactionStatus === TransactionStatusEnum.CONFIRMED
    ) {
      throw new UnauthorizedException('Order already completed');
    }
    walletTransaction.transactionStatus = TransactionStatusEnum.CONFIRMED;
    const wallet = await this.findOne(walletTransaction.wallet._id as any);
    wallet.ledgerBalance = wallet.ledgerBalance - walletTransaction.amount;
    await wallet.save();
    await walletTransaction.save();
    return walletTransaction;
  }
}
