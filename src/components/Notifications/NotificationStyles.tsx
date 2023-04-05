import styled from 'styled-components';
import { breakpoints, fontSizes } from '@/styles';

export const NotificationTitle = styled.div<{ isToast?: boolean }>`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textlight};

  ${({ isToast }) => isToast && `
    padding-right: 1.75rem;
  `}

  @media ${breakpoints.tablet} {
    ${fontSizes.size18}
  }
`;

export const NotificationBody = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textbase};
  margin-top: 0.375rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export const NotificationLink = styled.div`
  ${fontSizes.size14}
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export const NotificationContainer = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.layermediumlight};
  border-radius: 0.625rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.layerlighter};

    ${NotificationLink} {
      color: ${({ theme }) => theme.textlight};
    }
  }
`;

export const NotificationLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NotificationAltLink = styled.span`
  ${fontSizes.size14}
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }

  &:hover {
    color: ${({ theme }) => theme.textlight};

    > svg path {
      stroke: currentColor;
    }
  }
`;
