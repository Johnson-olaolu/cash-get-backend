import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import {
  IEmailConfirmationRequest,
  INotificationData,
  IPasswordChangeRequest,
} from './types';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { AppService } from './app/app.service';
import { WalletTransactionDocument } from 'src/wallet/schemas/walletTransaction.schema';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private appService: AppService,
  ) {}

  private generateNotificationReference(id: string) {
    const presentDate = moment().format('YYYYMMDD');
    const notificationReference = uniqid(
      `CG_${id}-`,
      `-${presentDate}`,
    ) as string;
    return notificationReference.toUpperCase();
  }

  async sendStoreCreatedSuccessfullyNotification(
    notificationData: INotificationData<null>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.user.id,
    );

    await this.emailService.sendStoreCreatedSuccessfullyNotification(
      notificationData,
      notificationReference,
    );
  }

  async sendEmailConfirmationRequestNotification(
    notificationData: INotificationData<IEmailConfirmationRequest>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.user.id,
    );

    await this.emailService.sendEmailConfirmationRequestNotification(
      notificationData,
      notificationReference,
    );
  }

  async sendEmailConfirmationSuccessNotification(
    notificationData: INotificationData<null>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.user.id,
    );

    await this.emailService.sendEmailConfirmationSuccessNotification(
      notificationData,
      notificationReference,
    );

    await this.appService.sendEmailConfirmationRequestNotification(
      notificationData,
      notificationReference,
    );
  }

  async sendChangePasswordRequestNotification(
    notificationData: INotificationData<IPasswordChangeRequest>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.user.id,
    );
    await this.emailService.sendChangePasswordUrlNotification(
      notificationData,
      notificationReference,
    );
  }

  async sendCreditAccountNotification(
    notificationData: INotificationData<WalletTransactionDocument>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.store.id,
    );

    await this.emailService.sendCreditAccountEmail(
      notificationData,
      notificationReference,
    );
    await this.appService.sendCreditWalletNotification(
      notificationData,
      notificationReference,
    );
  }
}
