/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { AppNotificationEnum } from 'src/utils/constants';
export type AppNotificationDocument = HydratedDocument<AppNotification>;

@Schema({
  timestamps: true,
})
export class AppNotification {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  // @Prop({
  //   unique: true,
  // })
  // token: string;

  @Prop({
    required: true,
  })
  summary: string;

  @Prop()
  notificationType: string;

  @Prop()
  notificationRef: string;

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
