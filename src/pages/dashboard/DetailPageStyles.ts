import styled from 'styled-components';

import { breakpoints } from '@/styles';

export const DetailPageLayoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;

  @media ${breakpoints.tablet} {
    flex-direction: column;
    margin-top: 0;
  }
`;

export const ContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(50% - 1rem);
  width: calc(50% - 1rem);

  @media ${breakpoints.tablet} {
    flex: 1 1 auto;
    width: 100%;
  }
`;

export const ContentRight = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(50% - 1rem);
  width: calc(50% - 1rem);

  @media ${breakpoints.tablet} {
    flex: 1 1 auto;
    width: calc(100% - 1rem);
    margin: 1rem 0.5rem 0;
  }
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;

  &:not(:first-child) {
    margin-top: 1.25rem;
  }

  @media ${breakpoints.mobile} {
    flex-direction: column;
  }

  > div {
    flex: 0 0 calc(50% - 0.5rem);

    @media ${breakpoints.mobile} {
      flex: 1 1 auto;
      width: 100%;

      &:last-child {
        margin-top: 1.25rem;
      }
    }
  }
`;
