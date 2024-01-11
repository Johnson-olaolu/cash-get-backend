/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { AppNotificationEnum } from 'src/utils/constants';
export type UserDocument = HydratedDocument<AppNotification>;

@Schema({
  timestamps: true,
})
export class AppNotification {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    unique: true,
  })
  token: string;

  @Prop()
  notificationType: string;

  @Prop()
  notificationId: string;

  @Prop({
    enum: AppNotificationEnum,
    default: AppNotificationEnum.CREATED,
  })
  status: AppNotificationEnum;

  @Prop()
  data: string;
}

export const AppNotificationSchema =
  SchemaFactory.createForClass(AppNotification);
