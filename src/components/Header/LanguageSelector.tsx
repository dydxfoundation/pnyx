import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import _ from 'lodash';

import { breakpoints, fontSizes } from 'styles';
import { SetSelectedLocalePayload } from 'types';
import { SupportedLocale } from 'enums';

import { useOnClickOutside } from 'hooks';
import { TriangleDownIcon } from 'icons';

import { SUPPORTED_LOCALE_STRING_LABELS } from 'constants/localization';

import { HeaderMenu, MenuOption } from './HeaderMenuStyles';

export type LanguageSelectorProps = {
  selectedLocale: SupportedLocale;
  setSelectedLocale: (payload: SetSelectedLocalePayload) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLocale,
  setSelectedLocale,
}) => {
  const menuRef = useRef(null);
  const [showLanguageSelectorMenu, setShowLanguageSelectorMenu] = useState<boolean>(false);

  useOnClickOutside({
    onClickOutside: () => {
      if (showLanguageSelectorMenu) {
        setShowLanguageSelectorMenu(false);
      }
    },
    ref: menuRef,
    dependencies: [showLanguageSelectorMenu],
  });

  return (
    <LanguageSelectorWrapper>
      <StyledLanguageSelector
        menuOpen={showLanguageSelectorMenu}
        onClick={() => setShowLanguageSelectorMenu(!showLanguageSelectorMenu)}
      >
        {SUPPORTED_LOCALE_STRING_LABELS[selectedLocale]} <TriangleDownIcon />
      </StyledLanguageSelector>
      {showLanguageSelectorMenu && (
        <HeaderMenu ref={menuRef}>
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
        </HeaderMenu>
      )}
    </LanguageSelectorWrapper>
  );
};

const LanguageSelectorWrapper = styled.div`
  position: relative;

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

const activeStyles = css`
  background-color: ${(props) => props.theme.layerdark};

  > svg path {
    fill: ${(props) => props.theme.textlight};
  }
`;

const StyledLanguageSelector = styled.div<
  React.HTMLAttributes<HTMLDivElement> & { menuOpen: boolean }
>`
  ${fontSizes.size16}
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.25rem;
  padding: 0 0.75rem;
  color: ${(props) => props.theme.textlight};
  background-color: ${(props) => props.theme.layerlight};
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;

  &:active {
    ${activeStyles}
  }

  > svg {
    margin-left: 0.5rem;

    path {
      fill: ${(props) => props.theme.textdark};
    }

    ${(props) =>
      props.menuOpen
        ? `
          transform: rotate(180deg);
        `
        : ''}
  }

  ${(props) =>
    props.menuOpen
      ? activeStyles
      : `
        &:hover {
          background-color: ${props.theme.layermediumlight};

          > svg path {
            fill: ${props.theme.textlight};
          }
        }
  `}
`;

export default LanguageSelector;
