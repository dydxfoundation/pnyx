import React from 'react';
import styled from 'styled-components';

import { LocalizationProps } from '@/types';
import { AssetSymbol } from '@/enums';

import { withLocalization } from '@/hoc';
import { breakpoints, fontSizes } from '@/styles';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import { STRING_KEYS } from '@/constants/localization';

export type DashboardHeroProps = {} & LocalizationProps;

const DashboardHero: React.FC<DashboardHeroProps> = ({ stringGetter }) => (
  <StyledHero>
    <AssetIcon size={AssetIconSize.Huge} symbol={AssetSymbol.DYDX} />
    <ContentContainer>
      <Label>{stringGetter({ key: STRING_KEYS.INTRODUCING_DYDX })}</Label>
      <Title>{stringGetter({ key: STRING_KEYS.WELCOME_TO_DYDX })}</Title>
    </ContentContainer>
  </StyledHero>
);

const StyledHero = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;

  @media ${breakpoints.tablet} {
    margin: 1.5rem 0 1rem;
  }

  @media ${breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0.5rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 20rem;
  margin-left: 1.5rem;

  @media ${breakpoints.desktopSmall} {
    margin-left: 1.25rem;
  }

  @media ${breakpoints.mobile} {
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const Label = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textdark};
`;

const Title = styled.div`
  ${fontSizes.size26};
  color: ${({ theme }) => theme.textlight};
  margin-top: 0.375rem;
`;

export default withLocalization(DashboardHero);
