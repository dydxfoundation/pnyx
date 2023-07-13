import React from 'react';
import styled from 'styled-components';

import { NotificationType } from '@/enums';

import { CloseIcon } from '@/icons';
import { breakpoints } from '@/styles';

import ClaimNotification from './ClaimNotification';
import DelegateNotification from './DelegateNotification';
import RequestWithdrawNotification from './RequestWithdrawNotification';
import StakeNotification from './StakeNotification';
import VoteNotification from './VoteNotification';
import WithdrawNotification from './WithdrawNotification';

type ToastContainerProps = {
  autoClose?: number;
  closeToast: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  notificationType: NotificationType;
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  autoClose,
  closeToast,
  data,
  notificationType,
}) => {
  if (autoClose) {
    setTimeout(closeToast, autoClose);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let NotificationComponent: React.FC<any> | undefined;

  switch (notificationType) {
    case NotificationType.Claim: {
      NotificationComponent = ClaimNotification;
      break;
    }
    case NotificationType.Delegate: {
      NotificationComponent = DelegateNotification;
      break;
    }
    case NotificationType.RequestWithdraw: {
      NotificationComponent = RequestWithdrawNotification;
      break;
    }
    case NotificationType.Stake: {
      NotificationComponent = StakeNotification;
      break;
    }
    case NotificationType.Vote: {
      NotificationComponent = VoteNotification;
      break;
    }
    case NotificationType.Withdraw: {
      NotificationComponent = WithdrawNotification;
      break;
    }
  }

  if (!NotificationComponent) {
    return null;
  }

  return (
    <StyledToastContainer>
      <CloseButton role="button" tabIndex={0} onClick={closeToast}>
        <CloseIcon />
      </CloseButton>
      <NotificationComponent closeToast={closeToast} data={data} isToast />
    </StyledToastContainer>
  );
};

const CloseButton = styled.div`
  display: none !important;
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  height: 1.75rem;
  width: 1.75rem;

  @media ${breakpoints.notTablet} {
    &:hover {
      background-color: ${({ theme }) => theme.layerlighter};

      > svg path {
        stroke: ${({ theme }) => theme.textlight};
      }
    }
  }

  @media ${breakpoints.tablet} {
    display: flex !important;
    width: 2rem;
    height: 2rem;
    top: 0.75rem;
    right: 0.75rem;

    > svg {
      width: 1rem;
      height: 1rem;
    }
  }

  > svg path {
    stroke: ${({ theme }) => theme.textbase};
  }
`;

const StyledToastContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media ${breakpoints.tablet} {
    ${CloseButton} {
      display: flex !important;
    }
  }

  &:hover {
    ${CloseButton} {
      display: flex !important;
    }
  }
`;

export default ToastContainer;
