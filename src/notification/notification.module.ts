import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailService } from './email/email.service';
import { PushService } from './push/push.service';
import { EmailModule } from './email/email.module';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppNotification,
  AppNotificationSchema,
} from './app/schemas/app-notification.schema';

@Global()
@Module({
  imports: [
    EmailModule,
    AppModule,
    MongooseModule.forFeature([
      { name: AppNotification.name, schema: AppNotificationSchema },
    ]),
  ],
  providers: [NotificationService, EmailService, PushService, AppService],
  exports: [NotificationService],
})
export class NotificationModule {}
