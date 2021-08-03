import styled from 'styled-components/macro';
import { breakpoints, fontSizes } from 'styles';

export const NotificationTitle = styled.div`
  ${fontSizes.size16}
  color: ${(props) => props.theme.textlight};

  @media ${breakpoints.tablet} {
    ${fontSizes.size18}
  }
`;

export const NotificationBody = styled.div`
  ${fontSizes.size14}
  color: ${(props) => props.theme.textbase};
  margin-top: 0.375rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export const NotificationLink = styled.div`
  ${fontSizes.size14}
  margin-top: 0.5rem;
  color: ${(props) => props.theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export const NotificationContainer = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.layermediumlight};
  border-radius: 0.625rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.layerlighter};

    ${NotificationLink} {
      color: ${(props) => props.theme.textlight};
    }
  }
`;
