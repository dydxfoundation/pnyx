import React from 'react';
import styled from 'styled-components/macro';

import { fontSizes } from 'styles';

type ElementProps = {
  noPadding?: boolean;
};

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
} & ElementProps;

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, noPadding }) => (
  <StyledSectionHeader noPadding={noPadding}>
    {title}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </StyledSectionHeader>
);

const StyledSectionHeader = styled.div<ElementProps>`
  ${fontSizes.size24}
  color: ${({ theme }) => theme.textlight};
  padding: ${({ noPadding }) => !noPadding && `0 1rem`};
`;

const Subtitle = styled.div`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.125rem;
`;

export default SectionHeader;
