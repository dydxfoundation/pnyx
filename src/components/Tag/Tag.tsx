import React from 'react';
import styled from 'styled-components/macro';

import { breakpoints, fontSizes } from 'styles';

export enum TagColor {
  Light = 'Light',
  Lighter = 'Lighter',
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
  color: ${(props) => props.theme.textlight};
  border-radius: 0.25rem;
  padding: 0.1875rem 0.25rem 0.1875rem 0.3125rem;
  margin-top: 0.0625rem;
  background-color: ${(props) => {
    switch (props.color) {
      case TagColor.Light: {
        return props.theme.layerlight;
      }
      case TagColor.Lighter: {
        return props.theme.layerlighter;
      }
    }

    return props.theme.layerlight;
  }};

  ${(props) => (props.marginLeft ? 'margin-left: 0.375rem;' : '')}
  ${(props) => (props.compact ? 'padding: 0.125rem 0.1875rem 0.125rem 0.25rem;' : '')}

  @media ${breakpoints.tablet} {
    ${fontSizes.size12}
  }
`;

export default Tag;
