/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
  WalletTransactionActionEnum,
} from 'src/utils/constants';
import { WalletDocument } from './wallet.schema';
import { TransactionDocument } from 'src/transaction/schemas/transaction.schema';

@Schema({
  timestamps: true,
})
export class WalletTransaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  wallet: WalletDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  transaction: TransactionDocument;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  prevBalance: number;

  @Prop({ required: true })
  currBalance: number;

  @Prop()
  transactionReference: string;

  @Prop()
  description: string;

  @Prop({ default: 'NGN' })
  currency: string;

  @Prop({ required: true, type: String, enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @Prop({ required: true, type: String, enum: WalletTransactionActionEnum })
  action: WalletTransactionActionEnum;

  @Prop({ required: true, type: String, enum: TransactionStatusEnum })
  transactionStatus: TransactionStatusEnum;
}
export type WalletTransactionDocument = HydratedDocument<WalletTransaction>;
export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
