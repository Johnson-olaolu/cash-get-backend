import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class StoreLocations {
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

export const StoreSchema = SchemaFactory.createForClass(StoreLocations);
