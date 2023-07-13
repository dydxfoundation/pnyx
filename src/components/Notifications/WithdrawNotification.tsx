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

export type WithdrawNotificationProps = {
  data: {
    txHash: string;
  };
} & LocalizationProps & ToastNotificationProps;

const WithdrawNotification: React.FC<WithdrawNotificationProps> = ({
  data: { txHash },
  isToast,
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open(`${import.meta.env.VITE_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
    }
  >
    <NotificationTitle isToast={isToast} >{stringGetter({ key: STRING_KEYS.WITHDRAW_FUNDS })}</NotificationTitle>
    <NotificationBody>{stringGetter({ key: STRING_KEYS.WITHDRAW_NOTIFICATION })}</NotificationBody>
    <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_ON_ETHERSCAN })} →</NotificationLink>
  </NotificationContainer>
);

export default withLocalization<WithdrawNotificationProps>(WithdrawNotification);
