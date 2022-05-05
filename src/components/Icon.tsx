import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';

const StyledIcon = styled.span`
  --icon-size: 1.15;
  --tablet-scale-factor: 1.1;

  align-self: center;
  vertical-align: middle;

  display: inline-grid;

  > svg {
    width: calc(var(--icon-size) * 1em);
    height: calc(var(--icon-size) * 1em);
  }

  @media ${breakpoints.tablet} {
    font-size: calc(var(--tablet-scale-factor) * 1em);
  }
`;

export const Icon: React.FC<{ icon?: React.FC }> = ({ icon: IconComponent }) =>
  IconComponent ? (
    <StyledIcon>
      <IconComponent />
    </StyledIcon>
  ) : null;
