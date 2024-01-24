import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppNotification } from './schemas/app-notification.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AppNotificationEnum } from 'src/utils/constants';

@WebSocketGateway({
  cors: true,
  namespace: 'notification',
})
export class AppNotificationGateway {
  constructor(
    @InjectModel(AppNotification.name)
    private appNotificationModel: Model<AppNotification>,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Handle connection event
    const userId = (client.handshake.query?.userId as string) || '';
    this.updateUserNotifications(userId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: Socket) {
    // Handle disconnection event
  }

  async updateUserNotifications(userId: string) {
    const notifications = await this.appNotificationModel.findOne({
      user: userId,
    });
    this.server.emit(userId, notifications);
  }

  @SubscribeMessage('notificationSeen')
  async handleNotificationSeen(client: any, payload: string) {
    const notification = await this.appNotificationModel.findById(payload);
    notification.status = AppNotificationEnum.SEEN;
    await notification.save();
    await this.updateUserNotifications(notification.user._id as any);
  }

  @SubscribeMessage('notificationDelete')
  async handleNotificationDelete(client: any, payload: string) {
    const notification = await this.appNotificationModel.findById(payload);
    await this.appNotificationModel.deleteOne({ _id: notification._id });
    this.updateUserNotifications(notification.user._id as any);
  }
}
