/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  TransactionProgressEnum,
  TransactionTypeEnum,
} from 'src/utils/constants';
import { MonnifyTransactionStatuses } from 'src/services/monnify/types';
import { WalletDocument } from 'src/wallet/schemas/wallet.schema';

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  wallet: WalletDocument;

  @Prop({ required: true, type: String, enum: TransactionTypeEnum })
  transactionType: TransactionTypeEnum;

  @Prop({ required: true })
  transactionReference: string;

  @Prop()
  transactionUrl: string;

  @Prop()
  externalTransactionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;

  @Prop({ default: 'NGN' })
  currency: string;

  @Prop({
    required: true,
    type: String,
    default: TransactionProgressEnum.STARTED,
    enum: TransactionProgressEnum,
  })
  progress: TransactionProgressEnum;

  @Prop({
    type: String,
    enum: MonnifyTransactionStatuses,
  })
  status: MonnifyTransactionStatuses;
}
export type TransactionDocument = HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
