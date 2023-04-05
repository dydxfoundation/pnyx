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

export type ClaimNotificationProps = {
  data: {
    txHash: string;
  };
} & LocalizationProps & ToastNotificationProps;

const ClaimNotification: React.FC<ClaimNotificationProps> = ({
  data: { txHash },
  isToast,
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open(`${import.meta.env.VITE_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
    }
  >
    <NotificationTitle isToast={isToast} >{stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}</NotificationTitle>
    <NotificationBody>
      {stringGetter({ key: STRING_KEYS.CLAIM_REWARDS_NOTIFICATION })}
    </NotificationBody>
    <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_ON_ETHERSCAN })} →</NotificationLink>
  </NotificationContainer>
);

export default withLocalization<ClaimNotificationProps>(ClaimNotification);
