import { AddNotificationPayload, Notification } from '@/types';

import { addNotification, clearNotifications, setSeenNotifications } from '@/actions/notifications';
import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  hasUnseenNotifications: boolean;
  notifications: Notification[];
};

type Action = {
  type: string;
  payload?: AddNotificationPayload;
};

const initialState: State = {
  hasUnseenNotifications: false,
  notifications: [],
};

export default function notificationsReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case addNotification().type: {
      if (payload) {
        return {
          ...state,
          hasUnseenNotifications: true,
          notifications: [payload, ...state.notifications],
        };
      }

      return state;
    }
    case setSeenNotifications().type: {
      return { ...state, hasUnseenNotifications: false };
    }
    case clearNotifications().type:
    case userAccountChanged().type:
    case disconnectWallet().type: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
}
