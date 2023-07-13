import { NotificationType } from '@/enums';

export type Notification = {
  notificationType: NotificationType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notificationData?: any;
};

export type AddNotificationPayload = Notification;
