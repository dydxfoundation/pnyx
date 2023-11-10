// @ts-ignore-next-line
import type { Proposals } from '@dydxfoundation-v3/governance';

import {
  GovernancePowersData,
  SetGovernancePowersDataPayload,
  SetLatestProposalsPayload,
  VotedOnProposalData,
  SetVotedOnProposalPayload,
} from '@/types';

import {
  setGovernancePowersData,
  setLatestProposals,
  setVotedOnProposal,
} from '@/actions/governance';

import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  governancePowers: GovernancePowersData;
  latestProposals?: Proposals[];
  votedOnProposals: VotedOnProposalData[];
};

type Action = {
  type: string;
  payload: SetGovernancePowersDataPayload & SetLatestProposalsPayload & SetVotedOnProposalPayload;
};

const userInitialState = {
  governancePowers: {},
  votedOnProposals: [],
};

const initialState: State = {
  ...userInitialState,
  latestProposals: undefined,
};

export default function governanceReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setGovernancePowersData().type: {
      return {
        ...state,
        governancePowers: {
          ...payload,
          lastPulledAt: new Date().toISOString(),
        },
      };
    }
    case setLatestProposals().type: {
      return {
        ...state,
        latestProposals: [...payload.proposals],
      };
    }
    case setVotedOnProposal().type: {
      return {
        ...state,
        votedOnProposals: [payload, ...state.votedOnProposals],
      };
    }
    case userAccountChanged().type:
    case disconnectWallet().type: {
      return { ...state, ...userInitialState };
    }
    default: {
      return state;
    }
  }
}
