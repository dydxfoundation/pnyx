import { Middleware } from 'redux';
import { toast } from 'react-toastify';

import { RootState } from 'store';

import { NotificationToast } from 'components/Notifications';

import { addNotification } from 'actions/notifications';
import { pageLoaded } from 'actions/page';
import { NotificationType } from 'enums';

const DEFAULT_AUTO_CLOSE_MS = 6000;

const notificationsMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
  next(action);

  const { type, payload } = action;

  if (type === addNotification().type) {
    const { notificationType } = payload;

    toast(({ closeToast }: { closeToast: () => void }) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      NotificationToast({
        autoClose: DEFAULT_AUTO_CLOSE_MS,
        closeToast,
        data: payload.notificationData,
        notificationType,
      })
    );
  }

  if (type === pageLoaded().type) {
    toast(({ closeToast }: { closeToast: () => void }) =>
      NotificationToast({
        // autoClose: DEFAULT_AUTO_CLOSE_MS,
        closeToast,
        data: {},
        notificationType: NotificationType.TradingRewardFormulaUpdate,
      })
    );
  }
};

export default notificationsMiddleware;
