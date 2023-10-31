import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, matchPath, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/store';
import { AppRoute, ExternalLink, ModalType } from '@/enums';
import { LocalizationProps } from '@/types';

import { breakpoints } from '@/styles';
import { HelpCircleIcon, LogoIcon } from '@/icons';
import { withLocalization } from '@/hoc';

import Button from '@/components/Button';
import Tag, { TagColor } from '@/components/Tag';

import { openModal as openModalAction } from '@/actions/modals';
import { setSelectedLocale as setSelectedLocaleAction } from '@/actions/localization';

import { getIsWalletConnecting, getWalletType, getWalletAddress } from '@/selectors/wallets';
import { getSelectedLocale } from '@/selectors/localization';

import { STRING_KEYS } from '@/constants/localization';

import LanguageSelector from './LanguageSelector';
import MobileNavigation from './MobileNavigation';
import WalletConnectedModules from './WalletConnectedModules';

import { MenuButton } from './HeaderMenuStyles';

export type HeaderProps = {} & LocalizationProps;

export type ConnectedHeaderProps = HeaderProps &
  RouteComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const UnconnectedHeader: React.FC<ConnectedHeaderProps> = ({
  history,
  isWalletConnecting,
  location,
  openModal,
  selectedLocale,
  setSelectedLocale,
  stringGetter,
  walletAddress,
  walletType,
}) => (
  <StyledHeader>
    <HeaderContent>
      <LeftContainer>
        <StyledLogo onClick={() => history.push(AppRoute.Dashboard)}>
          <LogoIcon />
        </StyledLogo>
        <LanguageSelector selectedLocale={selectedLocale} setSelectedLocale={setSelectedLocale} />
      </LeftContainer>
      <LinksContainer>
        <Button
          link
          active={!!matchPath(location.pathname, { path: AppRoute.Dashboard })}
          onClick={() => history.push(AppRoute.Dashboard)}
        >
          {stringGetter({ key: STRING_KEYS.DASHBOARD })}
        </Button>
        <Button
          link
          active={!!matchPath(location.pathname, { path: AppRoute.Migrate })}
          onClick={() => history.push(AppRoute.Migrate)}
        >
          {stringGetter({ key: STRING_KEYS.MIGRATE })}
          <Tag compact marginLeft color={TagColor.Purple}>
            {stringGetter({ key: STRING_KEYS.NEW })}
          </Tag>
        </Button>
        <Button
          link
          active={!!matchPath(location.pathname, { path: AppRoute.History })}
          onClick={() => {
            history.push(AppRoute.History);
          }}
        >
          {stringGetter({ key: STRING_KEYS.HISTORY })}
        </Button>
        <Button link linkOutIcon href={ExternalLink.Forums}>
          {stringGetter({ key: STRING_KEYS.FORUMS })}
        </Button>
        <Button link linkOutIcon onClick={() => openModal({ type: ModalType.TradeLink })}>
          {stringGetter({ key: STRING_KEYS.TRADE })}
        </Button>
      </LinksContainer>
      <RightContainer>
        <HelpButton onClick={() => window.open(ExternalLink.Documentation, '_blank')}>
          <HelpCircleIcon />
        </HelpButton>
        {walletAddress && walletType ? (
          <WalletConnectedModules walletAddress={walletAddress} walletType={walletType} />
        ) : (
          <StyledConnectButton>
            <Button
              useLargeStylesOnTablet={false}
              fullWidth={isWalletConnecting}
              isLoading={isWalletConnecting}
              onClick={() => openModal({ type: ModalType.Onboarding })}
            >
              {stringGetter({ key: STRING_KEYS.CONNECT })}
            </Button>
          </StyledConnectButton>
        )}
        <MobileNavigation />
      </RightContainer>
    </HeaderContent>
  </StyledHeader>
);

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  width: 100vw;

  padding: 1.5rem 3rem;
  background-color: ${({ theme }) => theme.layerbase};
  z-index: 2;
  box-shadow: 0px 0px 24px 8px rgba(26, 26, 39, 0.5);

  @media ${breakpoints.tablet} {
    position: fixed;
    top: var(--banner-height);
    left: 0;
    width: 100%;
    padding: 0.75rem 1.5rem;
    height: var(--header-height);
  }

  @media ${breakpoints.mobile} {
    padding: 0.75rem 1rem 0.75rem 1.25rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 70rem;
  width: 100%;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledLogo = styled.div<React.HTMLAttributes<HTMLDivElement>>`
  padding-top: 0.25rem;
  margin-bottom: -0.25rem;
  margin-right: 1.5rem;
  cursor: pointer;

  @media ${breakpoints.tablet} {
    padding-left: 0.25rem;
    margin-right: 0;
  }

  > svg {
    flex: 0 0 5.125rem;
    width: 5.125rem;
    height: 2.375rem;

    @media ${breakpoints.mobile} {
      flex: 0 0 4.75rem;
      width: 4.75rem;
      height: 2.25rem;
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1 1 auto;

  > button:not(:last-child) {
    margin-right: 0.25rem;
  }

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

const HelpButton = styled(MenuButton)`
  width: 2.5rem;
  margin-left: 0.25rem;

  > svg {
    height: 1.125rem;
    width: 1.125rem;
  }

  &:active {
    > svg rect {
      stroke: ${({ theme }) => theme.textlight};
    }
  }

  @media ${breakpoints.notTablet} {
    &:hover {
      > svg rect {
        stroke: ${({ theme }) => theme.textlight};
      }
    }
  }

  @media ${breakpoints.tablet} {
    > svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;

const StyledConnectButton = styled.div`
  margin-left: 0.75rem;
  min-width: 6.5rem;
`;

const mapStateToProps = (state: RootState) => ({
  isWalletConnecting: getIsWalletConnecting(state),
  selectedLocale: getSelectedLocale(state),
  walletAddress: getWalletAddress(state),
  walletType: getWalletType(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
      setSelectedLocale: setSelectedLocaleAction,
    },
    dispatch
  );

export default withLocalization<HeaderProps>(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(UnconnectedHeader))
);
