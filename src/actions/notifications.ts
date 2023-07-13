import { createAction } from 'redux-actions';

import { AddNotificationPayload } from '@/types';

export const addNotification = createAction<AddNotificationPayload | void>('ADD_NOTIFICATION');
export const clearNotifications = createAction<void>('CLEAR_NOTIFICATIONS');
export const setSeenNotifications = createAction<void>('SET_SEEN_NOTIFICATIONS');
