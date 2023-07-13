import { RootState } from '@/store';
import { Notification } from '@/types';

export const getHasUnseenNotifications = (state: RootState): boolean =>
  state.notifications.hasUnseenNotifications;

export const getNotifications = (state: RootState): Notification[] =>
  state.notifications.notifications;
