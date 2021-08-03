import React from 'react';
import styled from 'styled-components/macro';

import { fontSizes } from 'styles';

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <StyledSectionHeader>
    {title}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </StyledSectionHeader>
);

const StyledSectionHeader = styled.div`
  ${fontSizes.size24}
  color: ${(props) => props.theme.textlight};
  padding: 0 1rem;
`;

const Subtitle = styled.div`
  ${fontSizes.size16}
    color: ${(props) => props.theme.textdark};
    margin-top: 0.125rem;
  }
`;

export default SectionHeader;
