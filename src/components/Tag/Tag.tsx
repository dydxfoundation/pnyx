import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

export enum TagColor {
  Light = 'Light',
  Lighter = 'Lighter',
  Purple = 'Purple',
}

type ElementProps = {
  color?: TagColor;
  compact?: boolean;
  marginLeft?: boolean;
};

export type TagProps = {
  children: React.ReactNode;
} & ElementProps;

const Tag: React.FC<TagProps> = ({ children, ...otherProps }) => (
  <StyledTag {...otherProps}>{children}</StyledTag>
);

const StyledTag = styled.div<ElementProps>`
  ${fontSizes.size11}
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.08em;
  color: ${({ color, theme }) => color === TagColor.Purple ? theme.colorpurple : theme.textlight};
  border-radius: 0.25rem;
  padding: 0.1875rem 0.25rem 0.1875rem 0.3125rem;
  margin-top: 0.0625rem;

  background-color: ${({ color, theme }) => {
    switch (color) {
      case TagColor.Light: {
        return theme.layerlight;
      }
      case TagColor.Lighter: {
        return theme.layerlighter;
      }
      case TagColor.Purple: {
        return theme.layerpurplefaded;
      }
    }

    return theme.layerlight;
  }};

  ${({ marginLeft }) => (marginLeft ? 'margin-left: 0.375rem;' : '')}
  ${({ compact }) => (compact ? 'padding: 0.125rem 0.1875rem 0.125rem 0.25rem;' : '')}

  @media ${breakpoints.tablet} {
    ${fontSizes.size12}
  }
`;

export default Tag;
