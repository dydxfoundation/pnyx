import React from 'react';
import styled, { css } from 'styled-components';
import _ from 'lodash';

import { LinkOutIcon } from '@/icons';
import { breakpoints, fonts, fontSizes } from '@/styles';

import LoadingDots from '@/components/LoadingDots';

export enum ButtonColor {
  Light = 'Light',
  Lighter = 'Lighter',
  Purple = 'Purple',
}

export enum ButtonSize {
  Small = 'Small',
  Medium = 'Medium',
  Pill = 'Pill',
}

type ElementProps = {
  active?: boolean;
  color?: ButtonColor;
  fullWidth?: boolean;
  href?: string;
  isLoading?: boolean;
  link?: boolean;
  size?: ButtonSize;
  useLargeStylesOnTablet?: boolean;
};

export type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  linkOutIcon?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ElementProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & React.HTMLAttributes<HTMLButtonElement & HTMLDivElement>
>(
  (
    {
      children,
      href,
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

    // eslint-disable-next-line
    let Component: any;
    if (disabled) {
      Component = DisabledButton;
    } else if (href) {
      Component = StyledButtonLink;
    } else {
      Component = StyledButton;
    }

    return (
      <Component
        ref={ref}
        size={size}
        href={href}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        onClick={disabled || isLoading || !onClick ? _.noop : onClick}
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
  color: ${({ theme }) => theme.textlight};

  background-color: ${({ color, link, theme }) => {
    if (link) {
      return theme.layerdark;
    }

    if (color === ButtonColor.Light) {
      return theme.layerlightfaded;
    }

    if (color === ButtonColor.Lighter) {
      return theme.layerlighterfaded;
    }

    return theme.colorpurplefaded;
  }};

  ${({ link }) =>
    link
      ? `${StyledLinkIcon} > svg path {
        stroke: currentColor;
      }`
      : ''}
`;

const activeStylesWithHoverOverride = css<ElementProps>`
  ${activeStyles};

  &:hover {
    ${activeStyles};
  }
`;

const buttonStyles = css`
  ${fonts.medium}
  ${({ size }) => (size === ButtonSize.Pill ? fontSizes.size15 : fontSizes.size17)}
  
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ color, link, theme }) => {
    if (link) {
      return theme.textdark;
    }

    if (color === ButtonColor.Light) {
      return theme.textbase;
    }

    return theme.textlight;
  }};

  border-radius: ${({ size }) => (size === ButtonSize.Pill ? '1rem' : '0.5rem')};
  cursor: pointer;
  padding: ${({ size }) => (size === ButtonSize.Pill ? '0 0.75rem' : '0 1rem')};
  border: none;
  user-select: none;

  background-color: ${({ color, link, theme }) => {
    if (link) {
      return 'transparent';
    }

    if (color === ButtonColor.Light) {
      return theme.layerlight;
    }

    if (color === ButtonColor.Lighter) {
      return theme.layerlighter;
    }

    return theme.colorpurple;
  }};

  &:hover {
    ${({ link, theme }) => {
      const iconStyles = `
        ${StyledLinkIcon} > svg path {
            stroke: currentColor;
          }
      `;

      if (link) {
        return `
          color: ${theme.textlight};
          background-color: ${theme.layerlight};
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

  ${({ active }) => (active ? activeStylesWithHoverOverride : '')}

  ${({ fullWidth }) =>
    fullWidth
      ? css`
          width: 100%;
        `
      : ''}

  ${({ isLoading, size }) => {
    let fontSize = fontSizes.size17;
    let height = 2.5;
    let minHeight = 2.5;

    switch (size) {
      case ButtonSize.Small: {
        fontSize = fontSizes.size15;
        height = 2.25;
        minHeight = 2.25;
        break;
      }
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
      ${fontSize}
      height: ${height}rem;
      min-height: ${minHeight}rem;
      min-width: ${isLoading ? '5rem' : 'auto'};
    `;
  }}

  ${({ isLoading, size, useLargeStylesOnTablet }) => {
    if (useLargeStylesOnTablet) {
      let fontSize = fontSizes.size18;
      let height = 3;
      let minHeight = 3;

      switch (size) {
        case ButtonSize.Small: {
          fontSize = fontSizes.size17;
          height = 2.5;
          minHeight = 2.5;
          break;
        }
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
          min-width: ${isLoading ? '5rem' : 'auto'};
        }
      `;
    }

    return '';
  }}
`;

const StyledButton = styled.button<ElementProps>`
  ${buttonStyles}
`;

const StyledButtonLink = styled.a<ElementProps>`
  ${buttonStyles}
  text-decoration: none;
`;

const StyledLinkIcon = styled.div<ElementProps>`
  display: flex;
  align-items: center;

  > svg {
    margin-top: 0.125rem;
    margin-left: 0.25rem;
    height: 1rem;

    path {
      stroke: currentColor;
    }
  }
`;

const DisabledButton = styled(StyledButton)`
  cursor: not-allowed;
  background-color: ${({ theme }) => theme.layerlighter} !important;
  background: ${({ theme }) => theme.layerlighter} !important;
  color: ${({ theme }) => theme.textdark} !important;

  &:hover {
    filter: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 1rem;

  > button:not(:last-child),
  > a:not(:last-child) {
    margin-right: 0.75rem;
  }
`;
