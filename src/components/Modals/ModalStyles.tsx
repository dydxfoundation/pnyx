import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

export const ModalAlignedContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.75rem;

  // For Safari/Firefox compatibility
  &::after {
    flex: 0 0 1.5rem;
    content: '';
  }
`;

export const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem;

  // For Safari/Firefox compatibility
  &::after {
    flex: 0 0 1.5rem;
    content: '';
  }

  @media ${breakpoints.tablet} {
    flex: 1 1 auto;
    overflow: scroll;
  }
`;

export const ModalInfoFooter = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textdark};
  margin: 0.75rem 0.25rem 0;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;
