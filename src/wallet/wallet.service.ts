import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './schemas/wallet.schema';
import { Model } from 'mongoose';
import { WalletTransaction } from './schemas/walletTransaction.schema';
import {
  TransactionActionEnum,
  TransactionStatusEnum,
} from 'src/utils/constants';
import { generateReference } from 'src/utils/misc';
import { StoreDocument } from 'src/store/schemas/store.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
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
    const wallet = await this.walletModel.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!wallet) {
      throw new NotFoundException('No Wallet found for this id');
    }
    return wallet;
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

  async creditWallet(
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
      currBalance: wallet.balance - payload.amount,
      prevBalance: wallet.balance,
      transactionReference: payload.transactionReference,
      description: payload.description,
      amount: payload.amount,
      currency: payload.currency,
      transactionType: TransactionActionEnum.MONNIFY_CREDIT,
      transactionStatus: TransactionStatusEnum.CONFIRMED,
    });

    wallet.balance = wallet.balance - payload.amount;
    wallet.ledgerBalance = wallet.ledgerBalance - payload.amount;
    wallet.save();

    // Debit wallet notification
    // await this.mailService.sendDebitConfirmedMail(wallet.user, {
    //   currency: payload.currency,
    //   amount: payload.amount,
    // });
    return;
  }

  async initiateEscrowCredit(
    walletId: string,
    payload: { amount: number; currency: string },
  ) {
    const wallet = await this.findOne(walletId);

    if (payload.amount > wallet.balance) {
      throw new ForbiddenException('Wallet can not fund this order');
    }
    const transactionReference = generateReference(wallet.store.name);
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
