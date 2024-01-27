import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppNotification } from './schemas/app-notification.schema';
import { Model } from 'mongoose';
import { AppNotificationGateway } from './app.gateway';
import { INotificationData } from '../types';
import { WalletTransactionDocument } from 'src/wallet/schemas/walletTransaction.schema';

@Injectable()
export class AppService {
  constructor(
    private appNotificationGateway: AppNotificationGateway,
    @InjectModel(AppNotification.name)
    private appNotificationModel: Model<AppNotification>,
  ) {}

  async sendEmailConfirmationRequestNotification(
    data: INotificationData<null>,
    ref: string,
  ) {
    await this.appNotificationModel.create({
      data: data,
      notificationRef: ref,
      summary: `Your email ${data.user.email} has been confirmed`,
      notificationType: 'EmailConfirmationRequest',
      user: data.user,
    });
    await this.appNotificationGateway.updateUserNotifications(
      data.user._id as any,
    );
  }

  async sendCreditWalletNotification(
    data: INotificationData<WalletTransactionDocument>,
    ref: string,
  ) {
    await this.appNotificationModel.create({
      data: data,
      notificationRef: ref,
      summary: `Walet credited with ${data.data.amount}`,
      notificationType: 'CreditWallet',
      user: data.user,
    });
    await this.appNotificationGateway.updateUserNotifications(
      data.user._id as any,
    );
  }
}
