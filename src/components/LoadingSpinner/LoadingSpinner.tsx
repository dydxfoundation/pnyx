import React from 'react';
import styled, { keyframes } from 'styled-components';

export enum SpinnerSize {
  Medium = 'Medium',
  Large = 'Large',
}

export type LoadingSpinnerProps = {
  id?: string;
  className?: string;
  size?: SpinnerSize;
};

// In some strange cases, hiding a spinner on one part of the page causes the linearGradient to
// be hidden on all other instances of the page. An id can be passed in to prevent this.
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  id,
  className,
  size = SpinnerSize.Medium,
}) => (
  <div className={className}>
    <StyledSpinner
      size={size}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BackgroundCircle cx="18" cy="18" r="17" strokeWidth="1.5" strokeOpacity="1" />
      <circle
        cx="18"
        cy="18"
        r="17"
        stroke={`url(#${id ? `${id}_loading_spinner_gradient` : 'loading_spinner_gradient'})`}
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient
          id={id ? `${id}_loading_spinner_gradient` : 'loading_spinner_gradient'}
          x1="36"
          y1="18"
          x2="24.75"
          y2="22.25"
          gradientUnits="userSpaceOnUse"
        >
          <GradientStop />
          <GradientStop offset="0.78125" stopOpacity="0" />
        </linearGradient>
      </defs>
    </StyledSpinner>
  </div>
);

const rotate = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const StyledSpinner = styled.svg<LoadingSpinnerProps & React.HTMLAttributes<HTMLElement>>`
  animation: ${rotate} 1.5s linear infinite;

  ${(props) => {
    switch (props.size) {
      case SpinnerSize.Medium: {
        return `
          height: 2.25rem;
          width: 2.25rem;
        `;
      }
      case SpinnerSize.Large: {
        return `
          height: 4.5rem;
          width: 4.5rem;

          > circle {
            stroke-width: 0.0625rem;
          }
        `;
      }
      default: {
        return `
          height: 2.25rem;
          width: 2.25rem;
        `;
      }
    }
  }}
`;

const BackgroundCircle = styled.circle`
  stroke: ${({ theme }) => theme.bordergrey};
`;

const GradientStop = styled.stop`
  stop-color: ${({ theme }) => theme.colorpurple};
`;

export default LoadingSpinner;
