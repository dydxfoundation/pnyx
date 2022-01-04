import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { StakingPoolRoute } from 'enums';
import { withLocalization } from 'hoc';
import { LinkOutIcon } from 'icons';
import { breakpoints } from 'styles';
import { LocalizationProps } from 'types';

import { STRING_KEYS } from 'constants/localization';

import {
  NotificationContainer,
  NotificationTitle,
  NotificationBody,
  NotificationLink,
  NotificationLinks,
  NotificationAltLink,
} from './NotificationStyles';

export type TradingFormulaNotificationProps = { isToast?: boolean } & LocalizationProps & RouteComponentProps;

const TradingFormulaNotification: React.FC<TradingFormulaNotificationProps> = ({
  history,
  isToast,
  stringGetter,
}) => (
  <NotificationContainer
  onClick={() => history.push(StakingPoolRoute.SafetyPool)}
  >
    <NotificationTitle isToast={isToast} >{stringGetter({ key: STRING_KEYS.UPDATED_TRADING_FORMULA })}</NotificationTitle>
    <NotificationBody>
      {stringGetter({ key: STRING_KEYS.UPDATED_TRADING_FORMULA_DESC })}
    </NotificationBody>
    <NotificationLinks>
      <NotificationLink>
        {stringGetter({ key: STRING_KEYS.STAKE_DYDX })} →
      </NotificationLink>
      <NotificationAltLink onClick={(e) => {
        e.stopPropagation();
        window.open('https://forums.dydx.community/proposal/discussion/2940-drc-update-trading-liquidity-provider-rewards-formulas-to-include-holding-of-stkdydx/', '_blank');
      }}>
        {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
        <StyledLinkOutIcon />
      </NotificationAltLink>
    </NotificationLinks>
  </NotificationContainer>
);

const StyledLinkOutIcon = styled(LinkOutIcon)`
  width: 13px;
  margin-left: 2px;

  @media ${breakpoints.tablet} {
    width: 15px;
    margin-left: 3px;
  }
`;

export default withLocalization(withRouter(TradingFormulaNotification));
