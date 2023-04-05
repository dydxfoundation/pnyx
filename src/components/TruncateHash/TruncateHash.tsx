import React from 'react';
import styled from 'styled-components';

import { fontSizes } from '@/styles';

export type TruncateHashProps = {
  hash: string;
  charsPerSide?: number;
};

const TruncateHash: React.FC<TruncateHashProps> = ({ hash, charsPerSide = 4 }) => {
  if (!hash) {
    return null;
  }

  let i = 0;
  if (hash[0] === '0' && hash[1] === 'x') {
    i = 2;
  }

  const firstHalf = hash.slice(i, i + charsPerSide);
  const secondHalf = hash.slice(-1 * charsPerSide);

  return (
    <StyledTruncateHash>
      0x{firstHalf}····{secondHalf}
    </StyledTruncateHash>
  );
};

const StyledTruncateHash = styled.div`
  ${fontSizes.size14}
  display: flex;
  align-items: center;
  letter-spacing: 0.0875rem;
  color: ${({ theme }) => theme.textlight};
`;

export default TruncateHash;
