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
  padding: ${({ noPadding }) => !noPadding && `0 1rem`};
`;

Styled.Subtitle = styled.div`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.125rem;
`;

export default SectionHeader;
