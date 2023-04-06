import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import _ from 'lodash';

import { breakpoints, fontSizes } from '@/styles';
import { SetSelectedLocalePayload } from '@/types';
import { SupportedLocale } from '@/enums';

import { TriangleDownIcon } from '@/icons';

import { SUPPORTED_LOCALE_STRING_LABELS } from '@/constants/localization';

import { HeaderMenu, MenuOption, withMenuBackdrop } from './HeaderMenuStyles';

export type LanguageSelectorProps = {
  selectedLocale: SupportedLocale;
  setSelectedLocale: (payload: SetSelectedLocalePayload) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLocale,
  setSelectedLocale,
}) => {
  const [showLanguageSelectorMenu, setShowLanguageSelectorMenu] = useState<boolean>(false);

  return (
    <LanguageSelectorWrapper>
      <StyledLanguageSelector
        menuOpen={showLanguageSelectorMenu}
        onClick={() => setShowLanguageSelectorMenu(!showLanguageSelectorMenu)}
      >
        {SUPPORTED_LOCALE_STRING_LABELS[selectedLocale]} <TriangleDownIcon />
      </StyledLanguageSelector>
      {showLanguageSelectorMenu && (
        <HeaderMenu>
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
  background-color: ${({ theme }) => theme.layerdark};

  > svg path {
    fill: ${({ theme }) => theme.textlight};
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
  color: ${({ theme }) => theme.textlight};
  background-color: ${({ theme }) => theme.layerlight};
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;

  &:active {
    ${activeStyles}
  }

  > svg {
    margin-left: 0.5rem;

    path {
      fill: ${({ theme }) => theme.textdark};
    }

    ${({ menuOpen }) =>
      menuOpen
        ? `
          transform: rotate(180deg);
        `
        : ''}
  }

  ${({ theme, menuOpen }) =>
    menuOpen
      ? css`
          ${activeStyles}
          ${withMenuBackdrop}
        `
      : css`
          &:hover {
            background-color: ${theme.layermediumlight};

            > svg path {
              fill: ${theme.textlight};
            }
          }
        `}
`;

export default LanguageSelector;
