import { Injectable } from '@nestjs/common';
import {
  IEmailConfirmationRequest,
  INotificationData,
  notificationMedium,
  notificationType,
} from './types';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationService {
  constructor(private emailService: EmailService) {}
  sendNotification(type: notificationType) {
    return {
      medium: (medium: notificationMedium[]) => {
        if (type == 'EmailConfirmationRequest') {
          return {
            send: (data: INotificationData<IEmailConfirmationRequest>) => {
              if (medium.includes('email')) {
                const emailImplementation = this.emailService.sendEmail(type);
                emailImplementation(data);
              }
            },
          };
        }
      },
    };
  }
}
