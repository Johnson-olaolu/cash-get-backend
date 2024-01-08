import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { StoreLocations } from './store-locations.schema';
import { StoreTypeEnum } from 'src/utils/constants';

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
  email: string;

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
  coordinator: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  admins: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'StoreLocations' }])
  locations: StoreLocations[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
