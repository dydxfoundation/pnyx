import styled from 'styled-components';
import { breakpoints } from '@/styles';

export enum CardColor {
  Dark = 'Dark',
  Light = 'Light',
}

export enum CardSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export const CardWrapper = styled.div<{
  size?: CardSize;
  smallViewportAutoHeight?: boolean;
}>`
  min-height: 10rem;
  border-radius: 0.75rem;
  overflow: hidden;

  > div {
    min-height: 10rem;
  }

  ${(props) => {
    switch (props.size) {
      case CardSize.Small: {
        return `
          flex: 0 0 17.25rem;
          width: 17.25rem;
        `;
      }
      case CardSize.Medium: {
        return `
          flex: 0 0 20rem;
          width: 20rem;
        `;
      }
      case CardSize.Large: {
        return `
          flex: 0 0 22.5rem;
          width: 22.5rem;
        `;
      }
      default: {
        break;
      }
    }

    return `
      flex: 0 0 22.5rem;
      width: 22.5rem;
    `;
  }}

  ${(props) =>
    props.smallViewportAutoHeight
      ? `
        @media ${breakpoints.desktopSmall} {
          min-height: auto;
        }
      `
      : ''}

  @media ${breakpoints.desktopSmall} {
    width: auto;
    flex: 1 1 auto;
  }
`;

export const CardContainer = styled.div<{
  alignRight?: boolean;
  noMarginTop?: boolean;
  noWrap?: boolean;
}>`
  display: flex;
  flex-wrap: ${(props) => (props.noWrap ? 'nowrap' : 'wrap')};
  flex: 1 1 auto;
  margin-top: ${(props) => (props.noMarginTop ? '0' : '0.5rem')};

  @media ${breakpoints.mobile} {
    flex-wrap: wrap;
  }

  @media ${breakpoints.tablet} {
    flex-wrap: wrap;
    margin-top: 0;
  }

  > div {
    margin-top: 1.25rem;

    ${(props) =>
      props.alignRight
        ? `
          &:not(:first-child) {
            margin-left: 1.25rem;
          }
        `
        : `    
          &:not(:last-child) {
            margin-right: 1.25rem;
          }
        `};

    @media ${breakpoints.desktopSmall} {
      flex: 0 0 calc(50% - 0.625rem);
      width: calc(50% - 0.625rem);

      &:nth-child(1) {
        margin-left: 0;
        margin-right: 0;
      }

      &:nth-child(2) {
        margin-left: 1.25rem;
        margin-right: 0;
      }
    }

    @media ${breakpoints.mobile} {
      flex: 0 0 100%;
      width: 100%;

      &:nth-child(2) {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  ${(props) =>
    props.alignRight
      ? `
        margin-left: auto;
        justify-content: flex-end;
      `
      : ''};
`;

export const CardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
  padding: 1.25rem 1.5rem;
`;

export const TooltipIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.layerlighter};
  border-radius: 50%;
  height: 1.25rem;
  width: 1.25rem;
  margin-top: 0.125rem;
  margin-left: 0.375rem;
  cursor: help;

  > svg {
    height: 0.75rem;
    width: 0.5rem;
  }
`;

export const ValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-top: 0.125rem;
    margin-left: 0.375rem;
  }
`;
