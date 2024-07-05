import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '@/styles';

type ElementProps = {
  column?: boolean;
  withMarginTop?: boolean;
};

export type SectionWrapperProps = {
  children: React.ReactNode;
} & ElementProps;

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  column,
  withMarginTop = true,
}) => (
  <StyledSectionWrapper column={column} withMarginTop={withMarginTop}>
    {children}
  </StyledSectionWrapper>
);

export default SectionWrapper;

const StyledSectionWrapper = styled.div<ElementProps>`
  display: flex;
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
  margin-top: ${({ withMarginTop }) => (withMarginTop ? '4rem' : '1rem')};
  max-width: 70rem;
  width: 100%;

  @media ${breakpoints.tablet} {
    margin-top: 3rem;
  }
`;
