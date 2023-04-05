import React from 'react';

import { LocalizationProps, ToastNotificationProps } from '@/types';
import { withLocalization } from '@/hoc';

import { STRING_KEYS } from '@/constants/localization';

import {
  NotificationContainer,
  NotificationTitle,
  NotificationBody,
  NotificationLink,
} from './NotificationStyles';

export type RequestWithdrawNotificationProps = {
  data: {
    amount: string;
    symbol: string;
    txHash: string;
  };
} & LocalizationProps & ToastNotificationProps;

const RequestWithdrawNotification: React.FC<RequestWithdrawNotificationProps> = ({
  data: { amount, symbol, txHash },
  isToast,
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open(`${import.meta.env.VITE_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
    }
  >
    <NotificationTitle isToast={isToast} >{stringGetter({ key: STRING_KEYS.REQUEST_WITHDRAW })}</NotificationTitle>
    <NotificationBody>
      {stringGetter({
        key: STRING_KEYS.REQUEST_WITHDRAW_NOTIFICATION,
        params: {
          AMOUNT: amount,
          SYMBOL: symbol,
        },
      })}
    </NotificationBody>
    <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_ON_ETHERSCAN })} →</NotificationLink>
  </NotificationContainer>
);

export default withLocalization<RequestWithdrawNotificationProps>(RequestWithdrawNotification);
