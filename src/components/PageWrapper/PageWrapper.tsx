import React, { useRef } from 'react';
import styled from 'styled-components';

import { breakpoints } from '@/styles';
import { useScrollToTop } from '@/hooks';

export type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const wrapperRef = useRef(null);
  useScrollToTop({ ref: wrapperRef });

  return <StyledPageWrapper ref={wrapperRef}>{children}</StyledPageWrapper>;
};

export default PageWrapper;

const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5.5rem 3rem 3rem;
  height: 100%;
  overflow: scroll;

  @media ${breakpoints.tablet} {
    padding: 4.5rem 1.5rem 2rem;
  }

  @media ${breakpoints.mobile} {
    padding: 4.5rem 1rem 1.5rem;
  }
`;
