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

export type DelegateNotificationProps = {
  data: {
    txHash: string;
    isStakedToken?: boolean;
    isUndelegatePower?: boolean;
  };
} & LocalizationProps & ToastNotificationProps;

const DelegateNotification: React.FC<DelegateNotificationProps> = ({
  data: { txHash, isStakedToken, isUndelegatePower },
  isToast,
  stringGetter,
}) => {
  let notificationBodyKey;

  if (isUndelegatePower) {
    notificationBodyKey = isStakedToken
      ? STRING_KEYS.UNDELEGATE_STAKED_TOKEN_POWERS_NOTIFICATION
      : STRING_KEYS.UNDELEGATE_TOKEN_POWERS_NOTIFICATION;
  } else {
    notificationBodyKey = isStakedToken
      ? STRING_KEYS.DELEGATE_STAKED_TOKEN_POWERS_NOTIFICATION
      : STRING_KEYS.DELEGATE_TOKEN_POWERS_NOTIFICATION;
  }

  return (
    <NotificationContainer
      onClick={() =>
        window.open(`${import.meta.env.VITE_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
      }
    >
      <NotificationTitle isToast={isToast} >
        {stringGetter({
          key: isUndelegatePower ? STRING_KEYS.UNDELEGATE_POWERS : STRING_KEYS.DELEGATE_POWERS,
        })}
      </NotificationTitle>
      <NotificationBody>{stringGetter({ key: notificationBodyKey })}</NotificationBody>
      <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_ON_ETHERSCAN })} →</NotificationLink>
    </NotificationContainer>
  );
};

export default withLocalization<DelegateNotificationProps>(DelegateNotification);
