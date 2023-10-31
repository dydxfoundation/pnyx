import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps, matchPath } from 'react-router-dom';
import styled, { css } from 'styled-components';
import _ from 'lodash';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';
import { AppRoute, ExternalLink, ModalType, SupportedLocale } from '@/enums';

import { breakpoints, fontSizes } from '@/styles';
import { GlobeIcon, LinkOutIcon } from '@/icons';
import { withLocalization } from '@/hoc';

import AnimatedHamburgerClose from '@/components/AnimatedHamburgerClose';
import Tag, { TagColor } from '@/components/Tag';

import { openModal as openModalAction } from '@/actions/modals';
import { setSelectedLocale as setSelectedLocaleAction } from '@/actions/localization';

import { getSelectedLocale } from '@/selectors/localization';

import { STRING_KEYS, SUPPORTED_LOCALE_STRING_LABELS } from '@/constants/localization';

import { HeaderMenu, MenuOption, withMenuBackdrop } from './HeaderMenuStyles';

export type MobileNavigationProps = {} & LocalizationProps;

const MobileNavigation: React.FC<
  MobileNavigationProps &
    RouteComponentProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({ history, location, openModal, selectedLocale, setSelectedLocale, stringGetter }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showLanguageSelectorMenu, setShowLanguageSelectorMenu] = useState<boolean>(false);

  return (
    <>
      <StyledMobileNavigation role="button" tabIndex={0} onClick={() => setShowMenu(!showMenu)}>
        <AnimatedHamburgerClose isActive={showMenu} />
      </StyledMobileNavigation>
      {showMenu && (
        <MobileNavMenu>
          <IconButtons>
            <IconButtonWrapper>
              <IconButton
                menuOpen={showLanguageSelectorMenu}
                onClick={() => setShowLanguageSelectorMenu(!showLanguageSelectorMenu)}
              >
                <GlobeIcon />
                {showLanguageSelectorMenu && (
                  <LanguageSelectorMenu>
                    {_.map(SupportedLocale, (locale) => (
                      <MenuOption
                        key={locale}
                        active={selectedLocale === locale}
                        onClick={() => {
                          setSelectedLocale({ locale });
                          setShowLanguageSelectorMenu(false);
                        }}
                      >
                        {SUPPORTED_LOCALE_STRING_LABELS[locale]}
                      </MenuOption>
                    ))}
                  </LanguageSelectorMenu>
                )}
              </IconButton>
            </IconButtonWrapper>
          </IconButtons>
          <NavItems>
            <NavItem
              role="button"
              tabIndex={0}
              active={!!matchPath(location.pathname, { path: AppRoute.Dashboard })}
              onClick={() => {
                history.push(AppRoute.Dashboard);
                setShowMenu(false);
              }}
            >
              {stringGetter({ key: STRING_KEYS.DASHBOARD })}
            </NavItem>
            <NavItem
              role="button"
              tabIndex={0}
              active={!!matchPath(location.pathname, { path: AppRoute.Migrate })}
              onClick={() => {
                history.push(AppRoute.Migrate);
                setShowMenu(false);
              }}
            >
              {stringGetter({ key: STRING_KEYS.MIGRATE })}
              <Tag compact marginLeft color={TagColor.Purple}>
                {stringGetter({ key: STRING_KEYS.NEW })}
              </Tag>
            </NavItem>
            <NavItem
              role="button"
              tabIndex={0}
              active={!!matchPath(location.pathname, { path: AppRoute.History })}
              onClick={() => {
                history.push(AppRoute.History);
                setShowMenu(false);
              }}
            >
              {stringGetter({ key: STRING_KEYS.HISTORY })}
            </NavItem>
            <NavLinkItem href={ExternalLink.Forums} target="_blank" rel="noopener noreferrer">
              {stringGetter({ key: STRING_KEYS.FORUMS })}
              <LinkOutIcon />
            </NavLinkItem>
            <NavItem
              role="button"
              tabIndex={0}
              onClick={() => openModal({ type: ModalType.TradeLink })}
            >
              {stringGetter({ key: STRING_KEYS.TRADE })}
              <LinkOutIcon />
            </NavItem>
          </NavItems>
        </MobileNavMenu>
      )}
    </>
  );
};
const StyledMobileNavigation = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;

  @media ${breakpoints.tablet} {
    display: flex;
  }
`;

const MobileNavMenu = styled.div`
  display: none;
  justify-content: space-between;
  align-items: flex-end;
  position: fixed;
  top: calc(var(--banner-height) + var(--header-height));
  left: 0;
  height: calc(100% - calc(var(--banner-height) + var(--header-height)));
  width: 100%;
  background-color: ${({ theme }) => theme.layerbase};
  z-index: 1;
  padding: 1.5rem;

  @media ${breakpoints.tablet} {
    display: flex;
  }
`;

const NavItems = styled.div`
  ${fontSizes.size26};
  padding-right: 1.25rem;
`;

const navItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0;
  cursor: pointer;

  > svg {
    height: 1.25rem;
    width: 1.25rem;
    margin-top: 0.125rem;
    margin-left: 0.375rem;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  ${navItemStyles}
  color: ${({ active, theme }) => (active ? theme.textlight : theme.textdark)};
`;

const NavLinkItem = styled.a`
  ${navItemStyles}
  color: ${({ theme }) => theme.textdark};
  text-decoration: none;

  &:active,
  &:visited {
    ${navItemStyles}
  }
`;

const IconButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 0 0 3rem;
`;

const IconButtonWrapper = styled.div`
  position: relative;
`;

const IconButton = styled.div<{ menuOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  background-color: ${({ theme }) => theme.layerlighter};
  border-radius: 50%;
  cursor: pointer;
  margin-top: 1rem;

  > svg {
    max-height: 1.25rem;
  }

  ${({ menuOpen }) =>
    menuOpen &&
    css`
      ${withMenuBackdrop}
    `}
`;

const LanguageSelectorMenu = styled(HeaderMenu)`
  top: auto;
  right: auto;
  left: 4rem;
  bottom: 0;
`;

const mapStateToProps = (state: RootState) => ({
  selectedLocale: getSelectedLocale(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
      setSelectedLocale: setSelectedLocaleAction,
    },
    dispatch
  );

export default withLocalization<MobileNavigationProps>(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileNavigation))
);
