/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { notificationType } from 'src/notification/types';
import { UserDocument } from 'src/user/schemas/user.schema';
import { AppNotificationEnum } from 'src/utils/constants';
export type AppNotificationDocument = HydratedDocument<AppNotification>;

@Schema({
  timestamps: true,
})
export class AppNotification {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({
    required: true,
  })
  summary: string;

  @Prop({ required: true })
  notificationType: notificationType;

  @Prop()
  notificationRef: string;

  @Prop({
    enum: AppNotificationEnum,
    default: AppNotificationEnum.CREATED,
  })
  status: AppNotificationEnum;

  @Prop({ type: Object })
  data: any;
}

export const AppNotificationSchema =
  SchemaFactory.createForClass(AppNotification);
