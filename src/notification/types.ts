export interface INotification<T> {
  medium: notificationMedium[];
  data: INotificationData<T>;
}

export interface INotificationData<T> {
  recipientMail?: string;
  subject?: string;
  name?: string;
  title: string;
  data: T;
  extraInfo?: string;
}

export type notificationMedium = 'email' | 'push' | 'app';
export type notificationType =
  | 'EmailConfirmationRequest'
  | 'EmailConfirmed'
  | '';

export interface IEmailConfirmationRequest {
  token: string;
}
