import styled from 'styled-components';
import { breakpoints, fontSizes } from '@/styles';

export const OnboardingStepFooterLinks = styled.div`
  ${fontSizes.size15}
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.textdark};
  margin-top: 1rem;
  padding: 0 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }

  > * {
    cursor: pointer;
    user-select: none;

    &:hover {
      color: ${({ theme }) => theme.textbase};
    }

    &:only-child {
      margin-left: auto;
    }
  }
`;
