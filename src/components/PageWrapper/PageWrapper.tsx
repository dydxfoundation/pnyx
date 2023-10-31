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
  --banner-height: 3.25rem;
  --header-height: 4rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 3rem 3rem;
  height: 100%;
  overflow: scroll;

  @media ${breakpoints.tablet} {
    --banner-height: 4rem;
    padding: 7.75rem 1.5rem 2rem;
  }

  @media ${breakpoints.mobile} {
    padding: 7.75rem 1rem 1.5rem;
  }
`;
