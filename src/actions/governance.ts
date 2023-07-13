import { createAction } from 'redux-actions';

import {
  SetGovernancePowersDataPayload,
  SetLatestProposalsPayload,
  SetVotedOnProposalPayload,
} from '@/types';

export const setVotedOnProposal = createAction<SetVotedOnProposalPayload | void>(
  'SET_VOTED_ON_PROPOSAL'
);

export const setGovernancePowersData = createAction<SetGovernancePowersDataPayload | void>(
  'SET_GOVERNANCE_POWERS_DATA'
);

export const setLatestProposals = createAction<SetLatestProposalsPayload | void>(
  'SET_LATEST_PROPOSALS'
);
