import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TransactionDocument } from './schemas/transaction.schema';

@WebSocketGateway({ cors: true })
export class TransactionGateway {
  @WebSocketServer()
  server: Server;

  // handleConnection(client: Socket) {
  //   // Handle connection event
  // }

  // handleDisconnect(client: Socket) {
  //   // Handle disconnection event
  // }

  confirmTransfer(transactionId: string, message: TransactionDocument) {
    this.server.emit(transactionId, message);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    // @ConnectedSocket() client: Socket,
  ) {
    // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }
}
