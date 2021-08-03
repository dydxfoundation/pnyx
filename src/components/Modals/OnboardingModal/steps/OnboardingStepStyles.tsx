import styled from 'styled-components/macro';
import { breakpoints, fontSizes } from 'styles';

export const OnboardingStepFooterLinks = styled.div`
  ${fontSizes.size15}
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.textdark};
  margin-top: 1rem;
  padding: 0 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }

  > * {
    cursor: pointer;
    user-select: none;

    &:hover {
      color: ${(props) => props.theme.textbase};
    }

    &:only-child {
      margin-left: auto;
    }
  }
`;
