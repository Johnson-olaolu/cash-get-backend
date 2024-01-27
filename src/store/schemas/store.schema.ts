import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { StoreLocationDocument } from './store-locations.schema';
import { StoreTypeEnum } from 'src/utils/constants';
import { WalletDocument } from 'src/wallet/schemas/wallet.schema';

@Schema({
  timestamps: true,
})
export class Store {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  logo: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phoneNo: string;

  @Prop()
  briefInfo: string;

  @Prop()
  website: string;

  @Prop({
    type: String,
    enum: StoreTypeEnum,
    required: true,
  })
  type: StoreTypeEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  coordinator: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  wallet: WalletDocument;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  admins: UserDocument[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'StoreLocations' }])
  locations: StoreLocationDocument[];
}
export type StoreDocument = HydratedDocument<Store>;
export const StoreSchema = SchemaFactory.createForClass(Store);
