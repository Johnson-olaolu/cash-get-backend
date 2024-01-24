import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class StoreLocation {
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

  @Prop({
    required: true,
  })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  coordinator: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  admins: User[];
}
export type StoreLocationDocument = HydratedDocument<StoreLocation>;
export const StoreLocationSchema = SchemaFactory.createForClass(StoreLocation);
