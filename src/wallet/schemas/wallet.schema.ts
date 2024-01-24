/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Store } from 'src/store/schemas/store.schema';
import { WalletTransaction } from './walletTransaction.schema';

@Schema({
  timestamps: true,
})
export class Wallet {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store' })
  store: Store;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  public ledgerBalance: number;

  @Prop([{ type: mongoose.Types.ObjectId, ref: 'WalletTransactions' }])
  transactions: WalletTransaction[];
}
export type WalletDocument = HydratedDocument<Wallet>;
export const WalletSchema = SchemaFactory.createForClass(Wallet);
