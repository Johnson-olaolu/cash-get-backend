import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AppNotificationGateway } from './app.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppNotification,
  AppNotificationSchema,
} from './schemas/app-notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppNotification.name, schema: AppNotificationSchema },
    ]),
  ],
  providers: [AppService, AppNotificationGateway],
  exports: [AppService, AppNotificationGateway],
})
export class AppModule {}
