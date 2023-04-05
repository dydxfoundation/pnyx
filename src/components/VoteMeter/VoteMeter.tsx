import React from 'react';
import styled from 'styled-components';

type ElementProps = {
  halfwayMarker?: boolean;
};

export interface VoteMeterProps extends ElementProps {
  totalVotes: number;
  totalVotedFor?: number;
  totalVotedAgainst?: number;
}

const VoteMeter: React.FC<VoteMeterProps> = ({
  halfwayMarker,
  totalVotes,
  totalVotedFor,
  totalVotedAgainst,
}) => (
  <StyledVoteMeter halfwayMarker={halfwayMarker}>
    {!!totalVotedFor && (
      <VotesFor style={{ width: `${(totalVotedFor / totalVotes) * 100 - 0.5}%` }} />
    )}
    {!!totalVotedAgainst && (
      <VotesAgainst style={{ width: `${(totalVotedAgainst / totalVotes) * 100 - 0.5}%` }} />
    )}
  </StyledVoteMeter>
);

const StyledVoteMeter = styled.div<ElementProps & React.HTMLAttributes<HTMLElement>>`
  display: flex;
  position: relative;
  width: 100%;
  height: 0.3125rem;
  background-color: ${({ theme }) => theme.layerlighter};
  border-radius: 0.1875rem;

  ${(props) =>
    props.halfwayMarker
      ? `
        margin: 0.75rem 0;
        
        &::before, &::after {
          content: "";
          position: absolute;
          width: 0.125rem;
          height: 0.375rem;
          left: calc(50% - 0.0625rem);
          background-color: ${props.theme.textdark};
        }

        &::before {
          top: -0.75rem;
        }

        &::after {
          bottom: -0.75rem;
        }
        `
      : ''}
`;

const VotesFor = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colorgreen};
  border-radius: 0.1875rem;
`;

const VotesAgainst = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colorred};
  border-radius: 0.1875rem;
  margin-left: auto;
`;

export default VoteMeter;
