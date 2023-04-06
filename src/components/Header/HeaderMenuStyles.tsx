import styled, { css } from 'styled-components';
import { breakpoints, fontSizes } from '@/styles';

export const withMenuBackdrop = css`
  &:before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
  }
`;

const menuButtonActiveStyles = css`
  background-color: ${({ theme }) => theme.layerdark};

  > svg path {
    fill: ${({ theme }) => theme.textlight};
  }
`;

export const MenuButton = styled.div<React.HTMLAttributes<HTMLDivElement> & { menuOpen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${(props) => (props.menuOpen ? props.theme.layerdark : 'transparent')};

  &:active {
    ${menuButtonActiveStyles}
  }

  @media ${breakpoints.notTablet} {
    &:hover {
      background-color: ${(props) =>
        props.menuOpen ? props.theme.layerdark : props.theme.layerlight};

      > svg path {
        fill: ${({ theme }) => theme.textlight};
      }
    }
  }

  ${(props) =>
    props.menuOpen
      ? css`
          ${menuButtonActiveStyles}
          ${withMenuBackdrop}
        `
      : css`
          @media ${breakpoints.notTablet} {
            &:hover {
              background-color: ${props.theme.layermediumlight};

              > svg path {
                fill: ${props.theme.textlight};
              }
            }
          }
        `}
`;
export const HeaderMenu = styled.div`
  ${fontSizes.size16};
  position: absolute;
  top: 2.75rem;
  right: 0;
  background-color: ${({ theme }) => theme.layerlight};
  padding: 0.625rem;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 24px 8px rgba(26, 26, 39, 0.5);
  z-index: 2;
`;

export const MenuOption = styled.div<React.HTMLAttributes<HTMLDivElement> & { active?: boolean }>`
  display: flex;
  align-items: center;
  height: 2.375rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textbase};

  ${(props) =>
    props.active
      ? `
        background-color: ${props.theme.layerbase};
        color: ${props.theme.textlight};
      `
      : `
        @media ${breakpoints.notTablet} {
          &:hover {
            background-color: ${props.theme.layermediumlight};
            color: ${props.theme.textlight};
          }
        }
  `}

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;
