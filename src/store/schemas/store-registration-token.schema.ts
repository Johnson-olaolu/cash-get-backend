import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StoreLocationDocument } from './store-location.schema';
import { TokenStatusEnum, UserRolesEnum } from 'src/utils/constants';
import { StoreDocument } from './store.schema';

@Schema({
  timestamps: true,
})
export class StoreRegistrationToken {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  store: StoreDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  storeLocation: StoreLocationDocument;

  @Prop([{ type: String, enum: UserRolesEnum, required: true }])
  use: UserRolesEnum;

  @Prop({ required: true })
  token: string;

  @Prop()
  tokenTTl: Date;

  @Prop({
    enum: TokenStatusEnum,
    default: TokenStatusEnum.ACTIVE,
  })
  status: TokenStatusEnum;

  @Prop()
  registered: string;
}
export type StoreRegistrationTokenDocument =
  HydratedDocument<StoreRegistrationToken>;
export const StoreRegistrationTokenSchema = SchemaFactory.createForClass(
  StoreRegistrationToken,
);
