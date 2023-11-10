// @ts-ignore-next-line
import type { Proposals } from '@dydxfoundation-v3/governance';

import { RootState } from '@/store';
import { GovernancePowersData, VotedOnProposalData } from '@/types';

export const getGovernancePowersData = (state: RootState): GovernancePowersData =>
  state.governance.governancePowers;

export const getLatestProposals = (state: RootState): Proposals[] | undefined =>
  state.governance.latestProposals;

export const getVotedOnProposals = (state: RootState): VotedOnProposalData[] =>
  state.governance.votedOnProposals;
