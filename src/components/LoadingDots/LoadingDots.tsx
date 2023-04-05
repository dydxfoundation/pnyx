import React from 'react';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';

export type LoadingDotsProps = {
  size?: number;
};

const LoadingDots: React.FC<LoadingDotsProps> = ({ size = 4 }) => {
  const dots: React.ReactNode[] = [];
  _.times(3, (i: number) => dots.push(<i key={i} style={{ width: size, height: size }} />));

  return (
    <LoadingDotsContainer>
      <Dot>{dots}</Dot>
    </LoadingDotsContainer>
  );
};

const LoadingDotsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

const loadingAnimation = keyframes`
    0% {
      opacity: 0.2;
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: 0.2;
    }
`;

const Dot = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  user-select: none;

  > i {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.textlight};
    margin: 0 0.125rem;
    display: inline-block;
    animation: ${loadingAnimation} 1.4s infinite both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export default LoadingDots;
