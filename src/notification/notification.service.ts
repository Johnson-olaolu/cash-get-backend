import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import {
  IEmailConfirmationRequest,
  INotificationData,
  IPasswordChangeRequest,
} from './types';
import { UserDocument } from 'src/user/schemas/user.schema';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { AppService } from './app/app.service';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private appService: AppService,
  ) {}

  private generateNotificationReference(user: UserDocument) {
    const presentDate = moment().format('YYYYMMDD');
    const notificationReference = uniqid(
      `CG_${user._id}-`,
      `-${presentDate}`,
    ) as string;
    return notificationReference.toUpperCase();
  }

  async sendEmailConfirmationRequestNotification(
    notificationData: INotificationData<IEmailConfirmationRequest>,
  ) {
    const notificationReference = this.generateNotificationReference(
      notificationData.user,
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
      notificationData.user,
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
      notificationData.user,
    );
    await this.emailService.sendChangePasswordUrlNotification(
      notificationData,
      notificationReference,
    );
  }
}
