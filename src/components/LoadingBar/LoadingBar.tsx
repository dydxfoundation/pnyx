import React from 'react';
import styled, { keyframes } from 'styled-components';

type ElementProps = {
  useDarkStyles?: boolean;
};

export type LoadingBarProps = {
  height: number;
  width?: number;
  fullWidth?: boolean;
} & ElementProps;

const LoadingBar: React.FC<LoadingBarProps> = ({ height, width, fullWidth, useDarkStyles }) => (
  <StyledLoadingBar
    useDarkStyles={useDarkStyles}
    style={{ height: `${height}rem`, width: fullWidth ? '100%' : `${width}rem` }}
  />
);

const loadingAnimation = keyframes`
   from {
        left: -150%;
    }
    to   {
        left: 150%;
    }
`;

const StyledLoadingBar = styled.div<ElementProps>`
  position: relative;
  background-color: ${(props) =>
    props.useDarkStyles ? props.theme.layerlight : props.theme.layermediumlight};
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0 -0.125rem;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -100%;
    top: 0;
    height: 100%;
    width: 150%;
    animation: 1.5s ${loadingAnimation} ease-in-out infinite;
    opacity: 0.5;

    background: ${(props) =>
      props.useDarkStyles
        ? `linear-gradient(270deg, ${props.theme.layerlight} 0%, ${props.theme.loadingbarshinedark} 50%, ${props.theme.layerlight} 100%)`
        : `linear-gradient(270deg, ${props.theme.layermediumlight} 0%, ${props.theme.loadingbarshine} 50%, ${props.theme.layermediumlight} 100%)`};
  }
`;

export default LoadingBar;
