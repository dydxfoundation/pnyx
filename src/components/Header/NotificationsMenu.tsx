import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { AppDispatch } from '@/store';
import { LocalizationProps, Notification } from '@/types';
import { NotificationType } from '@/enums';

import { breakpoints, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';

import Button, { ButtonColor, ButtonSize } from '@/components/Button';

import {
  ClaimNotification,
  DelegateNotification,
  RequestWithdrawNotification,
  StakeNotification,
  VoteNotification,
  WithdrawNotification,
} from '@/components/Notifications';

import { clearNotifications as clearNotificationsAction } from '@/actions/notifications';

import { STRING_KEYS } from '@/constants/localization';

import { HeaderMenu } from './HeaderMenuStyles';

export type NotificationsMenuProps = {
  notifications: Notification[];
} & LocalizationProps;

type ConnectedNotificationsMenuProps = NotificationsMenuProps &
  ReturnType<typeof mapDispatchToProps>;

const NotificationsMenu = React.forwardRef<
  HTMLDivElement,
  ConnectedNotificationsMenuProps & React.HTMLAttributes<HTMLDivElement>
>(({ clearNotifications, notifications, stringGetter }, ref) => {
  useEffect(() => {
    toast.dismiss();
  }, []);

  const renderNotification = (notification: Notification): React.ReactNode => {
    const { notificationType, notificationData } = notification;

    switch (notificationType) {
      case NotificationType.Claim: {
        return <ClaimNotification data={notificationData} />;
      }
      case NotificationType.Delegate: {
        return <DelegateNotification data={notificationData} />;
      }
      case NotificationType.RequestWithdraw: {
        return <RequestWithdrawNotification data={notificationData} />;
      }
      case NotificationType.Stake: {
        return <StakeNotification data={notificationData} />;
      }
      case NotificationType.Vote: {
        return <VoteNotification data={notificationData} />;
      }
      case NotificationType.Withdraw: {
        return <WithdrawNotification data={notificationData} />;
      }
      default: {
        return undefined;
      }
    }
  };

  return (
    <StyledNotificationsMenu ref={ref}>
      <Header>
        {stringGetter({ key: STRING_KEYS.NOTIFICATIONS })}
        {!_.isEmpty(notifications) && (
          <Button
            color={ButtonColor.Lighter}
            size={ButtonSize.Pill}
            onClick={() => clearNotifications()}
          >
            {stringGetter({ key: STRING_KEYS.CLEAR })}
          </Button>
        )}
      </Header>
      <NoticationsContainer>
        {_.isEmpty(notifications) ? (
          <NotificationsEmptyState>
            {stringGetter({ key: STRING_KEYS.NOTIFICATIONS_EMPTY_STATE })}
          </NotificationsEmptyState>
        ) : (
          _.map(notifications, (notification, idx) => (
            <NotificationWrapper key={idx}>{renderNotification(notification)}</NotificationWrapper>
          ))
        )}
      </NoticationsContainer>
    </StyledNotificationsMenu>
  );
});

const StyledNotificationsMenu = styled(HeaderMenu)`
  top: 3rem;
  min-width: 21rem;

  @media ${breakpoints.mobile} {
    right: -7.5rem;
    width: 21rem;
    max-width: calc(100vw - 2rem);
  }
`;

const Header = styled.div`
  ${fontSizes.size20}
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.75rem;
  padding: 0.125rem 1rem 0.375rem 1.125rem;

  > button {
    margin-top: -0.125rem;
    color: ${({ theme }) => theme.colorred};

    &:active,
    &:hover,
    &:active:hover {
      color: ${({ theme }) => theme.colorred};
    }
  }
`;

const NoticationsContainer = styled.div`
  padding: 0 0.625rem;
`;

const NotificationsEmptyState = styled.div`
  ${fontSizes.size15}
  color: ${({ theme }) => theme.textdark};
  padding: 0 0.5rem 0.75rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

const NotificationWrapper = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0.5rem;
  }
`;

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      clearNotifications: clearNotificationsAction,
    },
    dispatch
  );

export default withLocalization<NotificationsMenuProps>(
  connect(null, mapDispatchToProps, null, { forwardRef: true })(NotificationsMenu)
);
