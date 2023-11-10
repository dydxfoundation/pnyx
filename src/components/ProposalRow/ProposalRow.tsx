import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import _ from 'lodash';

// @ts-ignore-next-line
import type { Proposals } from '@dydxfoundation-v3/governance';

import { LocalizationProps } from '@/types';
import { AppRoute, ProposalStatus } from '@/enums';

import { withLocalization } from '@/hoc';
import { CheckMarkIcon, XIcon } from '@/icons';
import { breakpoints, fontSizes } from '@/styles';

import ProposalStatusIcon, { ProposalStatusSize } from '@/components/ProposalStatusIcon';
import VoteMeter from '@/components/VoteMeter';

import { getStatusLabelKey, getTotalRequiredVotes } from '@/lib/proposals';

export type ProposalRowProps = {
  proposal: Proposals;
} & LocalizationProps;

const ProposalRow: React.FC<ProposalRowProps & RouteComponentProps> = ({
  history,
  proposal,
  stringGetter,
}) => {
  const {
    againstVotes: againstVotesString,
    dipId,
    forVotes: forVotesString,
    id,
    state: status,
    title,
    minimumQuorum: minimumQuorumString,
    minimumDiff: minimumDiffString,
  } = proposal;

  const statusLabelKey = getStatusLabelKey({ status });

  const againstVotes = Number(againstVotesString);
  const forVotes = Number(forVotesString);

  const minimumQuorum = Number(minimumQuorumString);
  const minimumDiff = Number(minimumDiffString);

  const totalVotes = getTotalRequiredVotes({
    againstVotes,
    forVotes,
    minimumDiff,
    minimumQuorum,
  });

  return (
    <StyledProposalRow
      status={status}
      onClick={() => history.push(`${AppRoute.ProposalDetail}/${id}`)}
    >
      <StatusIconTitle>
        <ProposalStatusIcon size={ProposalStatusSize.Medium} status={status} />
        DIP {dipId} - {title}
      </StatusIconTitle>
      <VoteContainer>
        <StatusLabel>
          {_.includes(
            [ProposalStatus.Succeeded, ProposalStatus.Queued, ProposalStatus.Executed],
            status
          ) && (
            <StyledCheckMark>
              <CheckMarkIcon />
            </StyledCheckMark>
          )}
          {_.includes([ProposalStatus.Failed, ProposalStatus.Expired], status) && (
            <StyledX>
              <XIcon />
            </StyledX>
          )}
          {stringGetter({ key: statusLabelKey || '' })}
        </StatusLabel>
        <VoteMeter
          halfwayMarker
          totalVotes={totalVotes}
          totalVotedFor={forVotes}
          totalVotedAgainst={againstVotes}
        />
      </VoteContainer>
    </StyledProposalRow>
  );
};

export const ProposalRowEmptyState: React.FC<{ title: string }> = ({ title }) => (
  <StyledProposalRow emptyState status={undefined}>
    <StatusIconTitle>{title}</StatusIconTitle>
  </StyledProposalRow>
);

const StyledProposalRow = styled.div<{ emptyState?: boolean; status?: ProposalStatus }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 4.625rem;
  border-radius: 0.75rem;
  padding: 0 1.25rem;

  ${(props) =>
    props.emptyState
      ? ''
      : `
    cursor: pointer;

    &:hover {
      filter: brightness(1.1);
    }
  `}

  background-color: ${(props) =>
    !props.status ||
    _.includes(
      [
        ProposalStatus.Pending,
        ProposalStatus.Canceled,
        ProposalStatus.Failed,
        ProposalStatus.Expired,
      ],
      props.status
    )
      ? props.theme.layerdark
      : props.theme.layerlight};

  @media ${breakpoints.tablet} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    min-height: ${(props) => (props.emptyState ? '4.625rem' : '6.625rem')};
    padding: 1rem 1.25rem;
  }
`;

const StatusIconTitle = styled.div`
  ${fontSizes.size20}
  display: flex;
  align-items: center;
  padding-right: 1.25rem;
  hyphens: auto;

  svg {
    margin-right: 1rem;
  }

  @media ${breakpoints.tablet} {
    padding-right: 0;
  }
`;

const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 15rem;
  margin-top: 0.125rem;

  @media ${breakpoints.tablet} {
    width: 100%;
    margin-top: 0.75rem;
  }
`;

const StatusLabel = styled.div`
  ${fontSizes.size16};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textbase};

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

const StyledIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 0.375rem;
  margin-top: 0.125rem;
`;

const StyledCheckMark = styled(StyledIcon)`
  > svg {
    height: 0.75rem;
    width: 0.75rem;
    stroke: ${({ theme }) => theme.colorgreen};
  }
`;

const StyledX = styled(StyledIcon)`
  > svg {
    height: 1rem;
    width: 1rem;

    path {
      stroke: ${({ theme }) => theme.colorred};
    }
  }
`;

export default withLocalization<ProposalRowProps>(withRouter(ProposalRow));
