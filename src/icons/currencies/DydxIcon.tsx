import React from 'react';

export type DydxIconProps = {
  id?: string;
};

const DydxIcon: React.FC<DydxIconProps> = ({ id }) => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="60" r="60" fill={`url(#dydx_gradient0${id})`} />
    <g filter={`url(#dydx_filter0${id})`}>
      <path d="M74.0553 29.7773L31.6662 90.217H44.6806L87.2895 29.7773H74.0553Z" fill="white" />
    </g>
    <path
      d="M46.0373 29.7773L58.5094 47.5869L52.0022 57.3012L32.7518 29.7773H46.0373Z"
      fill={`url(#dydx_gradient1${id})`}
    />
    <path
      d="M75.3194 90.2227L61.4917 70.5242L68.7012 61.0798L88.3338 90.2227H75.3194Z"
      fill={`url(#dydx_gradient2${id})`}
    />
    <defs>
      <filter
        id={`dydx_filter0${id}`}
        x="11.6662"
        y="9.77734"
        width="95.6233"
        height="100.44"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="10" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.206647 0 0 0 0 0.198416 0 0 0 0 0.330111 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <linearGradient
        id={`dydx_gradient0${id}`}
        x1="90"
        y1="8"
        x2="50"
        y2="118"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4D4C6A" />
        <stop offset="1" stopColor="#282844" />
      </linearGradient>
      <linearGradient
        id={`dydx_gradient1${id}`}
        x1="43.0549"
        y1="33.5551"
        x2="60.8082"
        y2="55.0899"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient
        id={`dydx_gradient2${id}`}
        x1="80.2386"
        y1="90.2227"
        x2="35.9889"
        y2="23.5518"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7370FF" />
        <stop offset="1" stopColor="#6966FF" stopOpacity="0.31" />
      </linearGradient>
    </defs>
  </svg>
);

export default DydxIcon;
