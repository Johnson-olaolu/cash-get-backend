/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TransactionTypeEnum } from 'src/utils/constants';
import { MonnifyTransactionStatuses } from 'src/services/monnify/types';
import { WalletTransactionDocument } from 'src/wallet/schemas/walletTransaction.schema';
import { WalletDocument } from 'src/wallet/schemas/wallet.schema';

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Wallet' })
  wallet: WalletDocument;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'WalletTransaction' })
  walletTransaction: WalletTransactionDocument;

  @Prop({ required: true, type: String, enum: TransactionTypeEnum })
  public transactionType: TransactionTypeEnum;

  @Prop({ required: true })
  public transactionReference: string;

  @Prop()
  public paymentReference: string;

  @Prop()
  public merchantName: string;

  @Prop()
  public enabledPaymentMethod: string;

  @Prop()
  public product: string;

  @Prop()
  public paidOn: Date;

  @Prop()
  public paymentDescription: string;

  @Prop()
  public metaData: string;

  @Prop()
  public paymentSourceInformation: string;

  @Prop()
  public amount: number;

  @Prop()
  public amountPaid: number;

  @Prop()
  public totalPayable: number;

  @Prop()
  public cardDetails: string;

  @Prop()
  public accountDetails: string;

  @Prop()
  public accountPayments: string;

  @Prop()
  public paymentMethod: string;

  @Prop()
  public currency: string;

  @Prop()
  public settlementAmount: string;

  @Prop()
  public paymentStatus: MonnifyTransactionStatuses;

  @Prop()
  public customer: string;

  @Prop()
  public destinationAccountName: string;

  @Prop()
  public destinationBankName: string;

  @Prop()
  public destinationAccountNumber: string;

  @Prop()
  public destinationBankCode: string;
}
export type TransactionDocument = HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
