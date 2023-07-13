import _ from 'lodash';

import { StakingPool } from '@/enums';
import { AllowancesState, SetAllowancePayload } from '@/types';

import { setAllowance, setUserSentAllowanceTransaction } from '@/actions/allowances';
import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  allowances: AllowancesState;
};

type Action = {
  type: string;
  payload: SetAllowancePayload;
};

const initialState: State = {
  allowances: {} as AllowancesState,
};

_.forEach(StakingPool, (pool: StakingPool) => {
  initialState.allowances[pool] = {};
});

export default function allowancesReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setAllowance().type: {
      const { stakingPool, allowance } = payload;

      return {
        ...state,
        allowances: {
          ...state.allowances,
          [stakingPool]: {
            ...state.allowances[stakingPool],
            allowance,
            lastPulledAt: new Date().toISOString(),
          },
        },
      };
    }
    case setUserSentAllowanceTransaction().type: {
      const { stakingPool } = payload;
      return {
        ...state,
        allowances: {
          ...state.allowances,
          [stakingPool]: {
            ...state.allowances[stakingPool],
            userSentAllowanceTransaction: true,
          },
        },
      };
    }
    case userAccountChanged().type:
    case disconnectWallet().type: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
}
