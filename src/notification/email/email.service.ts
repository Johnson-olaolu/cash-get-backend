import { Injectable } from '@nestjs/common';
import {
  IEmailConfirmationRequest,
  INotificationData,
  notificationType,
} from '../types';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  sendEmail(notificationType: notificationType) {
    switch (notificationType) {
      case 'EmailConfirmationRequest':
        return this.sendEmailRequestNotification;
      // default:
      //   return false;
    }
  }

  private async sendEmailRequestNotification(
    data: INotificationData<IEmailConfirmationRequest>,
  ) {
    const response = await this.mailerService.sendMail({
      to: data.recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: data.subject,
      template: 'defaultMail',
      context: {
        // logo: this.logo, remember to add the logo
        title: data.title,
        name: data.name,
        body: `use this token: <strong>${data.data.token}</strong> to confirm your email`,
        extraInfo: data.extraInfo || false,
      },
    });
    return response;
  }
}
