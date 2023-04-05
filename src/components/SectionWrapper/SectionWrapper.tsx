import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '@/styles';

type ElementProps = {
  column?: boolean;
};

export type SectionWrapperProps = {
  children: React.ReactNode;
} & ElementProps;

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, column }) => (
  <StyledSectionWrapper column={column}>{children}</StyledSectionWrapper>
);

export default SectionWrapper;

const StyledSectionWrapper = styled.div<ElementProps>`
  display: flex;
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
  margin-top: 4rem;
  max-width: 70rem;
  width: 100%;

  @media ${breakpoints.tablet} {
    margin-top: 3rem;
  }
`;
