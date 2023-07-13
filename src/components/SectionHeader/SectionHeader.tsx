import React from 'react';
import styled, { css } from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

type ElementProps = {
  noPadding?: boolean;
};

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
} & ElementProps;

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, noPadding }) => (
  <Styled.StyledSectionHeader noPadding={noPadding}>
    {title}
    {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
  </Styled.StyledSectionHeader>
);

// eslint-disable-next-line
const Styled: any = {};

Styled.StyledSectionHeader = styled.div<ElementProps>`
  ${fontSizes.size24}
  color: ${({ theme }) => theme.textlight};
  padding: 0 1.5rem;

  ${({ noPadding }) =>
    noPadding &&
    css`
      padding: 0;

      @media ${breakpoints.tablet} {
        padding: 0 0.25rem;
      }
    `}
`;

Styled.Subtitle = styled.div`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.125rem;
`;

export default SectionHeader;
