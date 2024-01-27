import { StoreDocument } from 'src/store/schemas/store.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

export interface INotification<T> {
  medium: notificationMedium[];
  data: INotificationData<T>;
}

export interface INotificationData<T> {
  user?: UserDocument;
  store?: StoreDocument;
  subject?: string;
  name?: string;
  title: string;
  data?: T;
  extraInfo?: string;
}

export type notificationMedium = 'email' | 'push' | 'app';
export type notificationType =
  | 'EmailConfirmationRequest'
  | 'EmailConfirmed'
  | 'CreditWallet'
  | '';

export interface IEmailConfirmationRequest {
  token: string;
}
export interface IPasswordChangeRequest {
  url: string;
}
