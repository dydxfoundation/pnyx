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

export type RequestWithdrawNotificationProps = {
  data: {
    amount: string;
    symbol: string;
    txHash: string;
  };
} & LocalizationProps;

const RequestWithdrawNotification: React.FC<RequestWithdrawNotificationProps> = ({
  data: { amount, symbol, txHash },
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open(`${process.env.REACT_APP_ETHERSCAN_BASE_URI}/tx/${txHash}`, '_blank')
    }
  >
    <NotificationTitle>{stringGetter({ key: STRING_KEYS.REQUEST_WITHDRAW })}</NotificationTitle>
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
