import React from 'react';
import styled from 'styled-components';

import LoadingSpinner from '@/components/LoadingSpinner';

export type LoadingSpaceProps = {
  id?: string;
  minHeight?: number;
};

const LoadingSpace: React.FC<LoadingSpaceProps> = ({ id, minHeight }) => {
  const props: { style?: { minHeight: string } } = {};

  if (minHeight) {
    props.style = { minHeight: `${minHeight}rem` };
  }

  return (
    <StyledLoadingSpace {...props}>
      <LoadingSpinner id={id} />
    </StyledLoadingSpace>
  );
};

const StyledLoadingSpace = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  justify-content: center;
  align-items: center;
`;

export default LoadingSpace;
