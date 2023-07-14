import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/store';
import { WalletType } from '@/enums';

import { breakpoints } from '@/styles';
import { BellIcon, BellAlertIcon, TriangleDownIcon } from '@/icons';

import TruncateHash from '@/components/TruncateHash';
import WalletIcon from '@/components/WalletIcon';

import { setSeenNotifications as setSeenNotificationsAction } from '@/actions/notifications';
import { getHasUnseenNotifications, getNotifications } from '@/selectors/notifications';

import WalletMenu from './WalletMenu';
import NotificationsMenu from './NotificationsMenu';
import { MenuButton } from './HeaderMenuStyles';

export type WalletConnectedModulesProps = {
  walletType: WalletType;
  walletAddress: string;
};

const WalletConnectedModules: React.FC<
  WalletConnectedModulesProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({
  hasUnseenNotifications,
  notifications,
  setSeenNotifications,
  walletType,
  walletAddress,
}) => {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState<boolean>(false);
  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);

  return (
    <StyledWalletConnectedModules>
      <ButtonWrapper>
        <NotificationsButton
          menuOpen={showNotificationsMenu}
          onClick={() => {
            if (!showNotificationsMenu && hasUnseenNotifications) {
              setSeenNotifications();
            }

            setShowNotificationsMenu(!showNotificationsMenu);
          }}
        >
          {hasUnseenNotifications ? (
            <BellAlertIcon id="bell-icon-desktop" />
          ) : (
            <BellIcon id="bell-icon-desktop" />
          )}
        </NotificationsButton>
        {showNotificationsMenu && <NotificationsMenu notifications={notifications} />}
      </ButtonWrapper>
      <ButtonWrapper>
        <WalletButton menuOpen={showWalletMenu} onClick={() => setShowWalletMenu(!showWalletMenu)}>
          <StyledWalletIcon menuOpen={showWalletMenu}>
            <WalletIcon walletType={walletType} />
          </StyledWalletIcon>
          <WalletAddress>
            <TruncateHash hash={walletAddress} />
          </WalletAddress>
          <TriangleDownIcon />
        </WalletButton>
        {showWalletMenu && (
          <WalletMenu
            closeMenu={() => setShowWalletMenu(false)}
            walletAddress={walletAddress}
            walletType={walletType}
          />
        )}
      </ButtonWrapper>
    </StyledWalletConnectedModules>
  );
};

const StyledWalletConnectedModules = styled.div`
  display: flex;
  margin-left: 0.25rem;
`;

const ButtonWrapper = styled.div`
  position: relative;
`;

const NotificationsButton = styled(MenuButton)`
  width: 2.5rem;

  > svg {
    height: 1.125rem;
    width: 1.125rem;
  }

  @media ${breakpoints.tablet} {
    > svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;

const WalletButton = styled(MenuButton)`
  justify-content: space-between;
  width: 12rem;
  margin-left: 0.5rem;
  padding: 0 0.75rem 0 0.625rem;
  background-color: ${(props) => (props.menuOpen ? props.theme.layerdark : props.theme.layerlight)};

  @media ${breakpoints.notTablet} {
    &:hover {
      background-color: ${(props) =>
        props.menuOpen ? props.theme.layerdark : props.theme.layerlighter};
    }
  }

  @media ${breakpoints.tablet} {
    width: auto;
  }

  > svg {
    margin-left: 0.5rem;

    path {
      fill: ${({ theme }) => theme.textdark};
    }

    ${(props) =>
      props.menuOpen
        ? `
          transform: rotate(180deg);

          path {
            fill: ${props.theme.textlight};
          }
        `
        : ''}
  }
`;

const WalletAddress = styled.div`
  @media ${breakpoints.tablet} {
    display: none;
  }
`;

const StyledWalletIcon = styled.div<{ menuOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.875rem;
  width: 1.875rem;
  border-radius: 50%;
  margin-right: 0.25rem;

  @media ${breakpoints.tablet} {
    margin-right: 0;
  }

  > svg,
  > img {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

const mapStateToProps = (state: RootState) => ({
  hasUnseenNotifications: getHasUnseenNotifications(state),
  notifications: getNotifications(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      setSeenNotifications: setSeenNotificationsAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectedModules);
