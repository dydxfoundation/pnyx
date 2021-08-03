import React from 'react';
import styled, { css } from 'styled-components/macro';
import _ from 'lodash';

import { LinkOutIcon } from 'icons';
import { breakpoints, fonts, fontSizes } from 'styles';

import LoadingDots from 'components/LoadingDots';

export enum ButtonColor {
  Light = 'Light',
  Lighter = 'Lighter',
  Purple = 'Purple',
}

export enum ButtonSize {
  Medium = 'Medium',
  Pill = 'Pill',
}

type ElementProps = {
  active?: boolean;
  color?: ButtonColor;
  fullWidth?: boolean;
  isLoading?: boolean;
  link?: boolean;
  size?: ButtonSize;
  useLargeStylesOnTablet?: boolean;
};

export type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  linkOutIcon?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
} & ElementProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & React.HTMLAttributes<HTMLButtonElement & HTMLDivElement>
>(
  (
    {
      children,
      isLoading,
      linkOutIcon,
      size = ButtonSize.Medium,
      onClick,
      useLargeStylesOnTablet = true,
      ...otherProps
    },
    ref
  ) => {
    const { disabled } = otherProps;

    let Component;
    if (disabled) {
      Component = DisabledButton;
    } else {
      Component = StyledButton;
    }

    return (
      <Component
        ref={ref}
        size={size}
        onClick={disabled || isLoading ? _.noop : onClick}
        isLoading={isLoading}
        useLargeStylesOnTablet={useLargeStylesOnTablet}
        {...otherProps}
      >
        {isLoading ? (
          <LoadingDots size={4} />
        ) : (
          <>
            {children}
            {linkOutIcon && (
              <StyledLinkIcon {...otherProps}>
                <LinkOutIcon />
              </StyledLinkIcon>
            )}
          </>
        )}
      </Component>
    );
  }
);

export default Button;

const activeStyles = css<ElementProps>`
  color: ${(props) => props.theme.textlight};
  background-color: ${(props) => {
    if (props.link) {
      return props.theme.layerdark;
    }

    if (props.color === ButtonColor.Light) {
      return props.theme.layerlightfaded;
    }

    if (props.color === ButtonColor.Lighter) {
      return props.theme.layerlighterfaded;
    }

    return props.theme.colorpurplefaded;
  }};

  ${(props) =>
    props.link
      ? `${StyledLinkIcon} > svg path {
        stroke: ${props.theme.textlight};
      }`
      : ''}
`;

const activeStylesWithHoverOverride = css<ElementProps>`
  ${activeStyles};

  &:hover {
    ${activeStyles};
  }
`;

const StyledButton = styled.button<ElementProps>`
  ${fonts.medium}
  ${(props) => (props.size === ButtonSize.Pill ? fontSizes.size15 : fontSizes.size17)}
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => {
    if (props.link) {
      return props.theme.textdark;
    }

    if (props.color === ButtonColor.Light) {
      return props.theme.textbase;
    }

    return props.theme.textlight;
  }};

  border-radius: ${(props) => (props.size === ButtonSize.Pill ? '1rem' : '0.5rem')};
  cursor: pointer;
  padding: ${(props) => (props.size === ButtonSize.Pill ? '0 0.75rem' : '0 1rem')};
  border: none;
  user-select: none;

  background-color: ${(props) => {
    if (props.link) {
      return 'transparent';
    }

    if (props.color === ButtonColor.Light) {
      return props.theme.layerlight;
    }

    if (props.color === ButtonColor.Lighter) {
      return props.theme.layerlighter;
    }

    return props.theme.colorpurple;
  }};

  &:hover {
    ${(props) => {
      const iconStyles = `
        ${StyledLinkIcon} > svg path {
            stroke: ${props.theme.textlight};
          }
      `;

      if (props.link) {
        return `
          color: ${props.theme.textlight};
          background-color: ${props.theme.layerlight};
          ${iconStyles}
        `;
      }

      return `
        filter: brightness(1.1);
        ${iconStyles}
      `;
    }}
  }

  &.active,
  &:active:hover {
    ${activeStyles}
  }

  ${(props) => (props.active ? activeStylesWithHoverOverride : '')}

  ${(props) =>
    props.fullWidth
      ? css`
          width: 100%;
        `
      : ''}

  ${(props) => {
    let height = 2.5;
    let minHeight = 2.5;

    switch (props.size) {
      case ButtonSize.Medium: {
        height = 2.5;
        minHeight = 2.5;
        break;
      }
      case ButtonSize.Pill: {
        height = 2;
        minHeight = 2;
        break;
      }
      default: {
        break;
      }
    }

    return `
      height: ${height}rem;
      min-height: ${minHeight}rem;
      min-width: ${props.isLoading ? '5rem' : 'auto'};
    `;
  }}

  ${(props) => {
    if (props.useLargeStylesOnTablet) {
      let fontSize = fontSizes.size18;
      let height = 3;
      let minHeight = 3;

      switch (props.size) {
        case ButtonSize.Medium: {
          height = 3;
          minHeight = 3;
          break;
        }
        case ButtonSize.Pill: {
          fontSize = fontSizes.size16;
          height = 2;
          minHeight = 2;
          break;
        }
        default: {
          break;
        }
      }

      return `
        @media ${breakpoints.tablet} {
          ${fontSize}
          height: ${height}rem;
          min-height: ${minHeight}rem;
          min-width: ${props.isLoading ? '5rem' : 'auto'};
        }
      `;
    }

    return '';
  }}
`;

const StyledLinkIcon = styled.div<ElementProps>`
  display: flex;
  align-items: center;

  > svg {
    margin-top: 0.125rem;
    margin-left: 0.25rem;
    height: 1rem;

    path {
      stroke: ${(props) => {
        if (props.link) {
          return props.theme.textdark;
        }

        if (props.color === ButtonColor.Light) {
          return props.theme.textbase;
        }

        if (props.color === ButtonColor.Lighter) {
          return props.theme.textdark;
        }

        return props.theme.textlight;
      }};
    }
  }
`;

const DisabledButton = styled(StyledButton)`
  cursor: not-allowed;
  background-color: ${(props) => props.theme.layerlighter} !important;
  background: ${(props) => props.theme.layerlighter} !important;
  color: ${(props) => props.theme.textdark} !important;

  &:hover {
    filter: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 1rem;

  > button:not(:last-child) {
    margin-right: 0.75rem;
  }
`;
