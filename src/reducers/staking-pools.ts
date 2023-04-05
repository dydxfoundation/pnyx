import _ from 'lodash';

import { StakingPool } from '@/enums';

import {
  StakingPoolsData,
  StakingPoolsDataState,
  SetStakingPoolsDataPayload,
  UpdateStakingPoolsDataPayload,
} from '@/types';

import { setStakingPoolsData, updateStakingPoolsData } from '@/actions/staking-pools';

type Action = {
  type: string;
  payload: SetStakingPoolsDataPayload & UpdateStakingPoolsDataPayload;
};

const initialState: StakingPoolsDataState = {
  data: {} as StakingPoolsData,
  lastPulledAt: undefined,
};

_.forEach(StakingPool, (pool: StakingPool) => {
  initialState.data[pool] = {};
});

export default function stakingPoolsReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setStakingPoolsData().type: {
      const { stakingPoolsData } = payload;

      return {
        data: _.merge({}, state.data, stakingPoolsData),
        lastPulledAt: new Date().toISOString(),
      };
    }
    case updateStakingPoolsData().type: {
      const { stakingPool, data } = payload;

      return {
        ...state,
        data: {
          ...state.data,
          [stakingPool]: {
            ...state.data[stakingPool],
            ...data,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}
