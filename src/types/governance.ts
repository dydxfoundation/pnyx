// @ts-ignore-next-line
import type { UserGovernanceDelegatees, Proposals } from '@dydxfoundation-v3/governance';

export type GovernancePowersData = {
  proposalPower?: string;
  votingPower?: string;
  delegatees?: UserGovernanceDelegatees;
  lastPulledAt?: string;
};

export type SetGovernancePowersDataPayload = Omit<GovernancePowersData, 'lastPulledAt'>;

export type SetLatestProposalsPayload = {
  proposals: Proposals[];
};

export type VotedOnProposalData = {
  proposalId: number;
  votedFor: boolean;
  hasVoted: boolean;
};

export type SetVotedOnProposalPayload = VotedOnProposalData;

export type DelegatePowersTxHashes = {
  delegateStakedTokenTxHash?: string;
  delegateTokenTxHash?: string;
};
