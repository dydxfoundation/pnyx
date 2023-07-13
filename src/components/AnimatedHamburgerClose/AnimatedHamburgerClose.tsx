import React from 'react';
import styled from 'styled-components';

type ElementProps = {
  isActive: boolean;
};

export type AnimatedHamburgerCloseProps = {} & ElementProps;

const AnimatedHamburgerClose: React.FC<AnimatedHamburgerCloseProps> = ({ isActive }) => (
  <StyledAnimatedHamburgerClose>
    <HamburgerBox>
      <HamburgerInner isActive={isActive} />
    </HamburgerBox>
  </StyledAnimatedHamburgerClose>
);

const hamburgerLayerWidth = '1.125rem';
const hamburgerLayerHeight = '0.125rem';
const hamburgerLayerSpacing = '0.25rem';

const StyledAnimatedHamburgerClose = styled.div`
  display: flex;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
`;

const HamburgerInner = styled.span<ElementProps>`
  display: block;
  top: 50%;
  margin-top: ${hamburgerLayerHeight} / -2;

  &,
  &::before,
  &::after {
    width: ${hamburgerLayerWidth};
    height: ${hamburgerLayerHeight};
    background-color: ${({ theme }) => theme.textdark};
    border-radius: 0.0625rem;
    position: absolute;
  }

  &::before,
  &::after {
    content: '';
    display: block;
  }

  &::before {
    top: calc((${hamburgerLayerSpacing} + ${hamburgerLayerHeight}) * -1);
    transition: top 0.075s 0.12s ease, opacity 0.075s ease;
  }

  &::after {
    bottom: calc((${hamburgerLayerSpacing} + ${hamburgerLayerHeight}) * -1);
    transition: bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  ${(props) =>
    props.isActive
      ? `
        transform: rotate(45deg);
        transition-delay: 0.12s;
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

        &::before {
          top: 0;
          opacity: 0;
          transition: top 0.075s ease,
                      opacity 0.075s 0.12s ease;
        }

        &::after {
          bottom: 0;
          transform: rotate(-90deg);
          transition: bottom 0.075s ease,
                      transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `
      : ''}
`;

const HamburgerBox = styled.span`
  width: ${hamburgerLayerWidth};
  height: calc(${hamburgerLayerHeight} * 3 + ${hamburgerLayerSpacing} * 2);
  display: inline-block;
  position: relative;
`;

export default AnimatedHamburgerClose;
