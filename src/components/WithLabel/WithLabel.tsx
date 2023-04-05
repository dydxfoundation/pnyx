import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

export enum WithLabelColor {
  Base = 'Base',
  Dark = 'Dark',
}

type ElementProps = {
  color?: WithLabelColor;
  noMargin?: boolean;
};

export type WithLabelProps = {
  children: React.ReactNode;
  label: React.ReactNode;
} & ElementProps;

const WithLabel: React.FC<WithLabelProps> = ({ children, color, label, noMargin }) => (
  <StyledWithLabel noMargin={noMargin}>
    <Label color={color}>{label}</Label>
    {children}
  </StyledWithLabel>
);

const StyledWithLabel = styled.div<ElementProps>`
  margin-bottom: ${({ noMargin }) => (noMargin ? '0' : '0.75rem')};
`;

const Label = styled.div<ElementProps>`
  ${fontSizes.size13}
  margin-bottom: 0.625rem;
  margin-left: 0.25rem;

  color: ${({ color, theme }) => {
    switch (color) {
      case WithLabelColor.Base: {
        return theme.textbase;
      }
      case WithLabelColor.Dark: {
        return theme.textdark;
      }
    }

    return theme.textdark;
  }};

  @media ${breakpoints.tablet} {
    ${fontSizes.size15};
  }
`;

export default WithLabel;
