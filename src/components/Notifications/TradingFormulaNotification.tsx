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

export type TradingFormulaNotificationProps = LocalizationProps;

const TradingFormulaNotification: React.FC<TradingFormulaNotificationProps> = ({
  stringGetter,
}) => (
  <NotificationContainer
    onClick={() =>
      window.open('https://forums.dydx.community/proposal/discussion/2940-drc-update-trading-liquidity-provider-rewards-formulas-to-include-holding-of-stkdydx/', '_blank')
    }
  >
    <NotificationTitle>{stringGetter({ key: STRING_KEYS.UPDATED_TRADING_FORMULA })}</NotificationTitle>
    <NotificationBody>
      {stringGetter({ key: STRING_KEYS.UPDATED_TRADING_FORMULA_DESC })}
    </NotificationBody>
    <NotificationLink>{stringGetter({ key: STRING_KEYS.VIEW_PROPOSAL })} →</NotificationLink>
  </NotificationContainer>
);

export default withLocalization<TradingFormulaNotificationProps>(TradingFormulaNotification);
