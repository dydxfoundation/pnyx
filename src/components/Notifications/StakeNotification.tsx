import React from 'react';

import { LocalizationProps } from 'types';
import { withLocalization } from 'hoc';

import { STRING_KEYS } from 'constants/localization';

import {
  NotificationContainer,
  NotificationTitle,
  NotificationBody,
  NotificationLink,
} from './NotificationStyles';

export type StakeNotificationProps = {
  data: {
    amount: string;
    symbol: string;
    txHash: string;
  };
} & LocalizationProps;

const StakeNotification: React.FC<StakeNotificationProps> = ({
  data: { amount, symbol, txHash },
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open(`${process.env.REACT_APP_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
    }
  >
    <NotificationTitle>{stringGetter({ key: STRING_KEYS.STAKE_FUNDS })}</NotificationTitle>
    <NotificationBody>
      {stringGetter({
        key: STRING_KEYS.STAKE_NOTIFICATION,
        params: {
          AMOUNT: amount,
          SYMBOL: symbol,
        },
      })}
    </NotificationBody>
    <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_ON_ETHERSCAN })} →</NotificationLink>
  </NotificationContainer>
);

export default withLocalization<StakeNotificationProps>(StakeNotification);
