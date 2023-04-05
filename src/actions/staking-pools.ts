import { createAction } from 'redux-actions';
import { SetStakingPoolsDataPayload, UpdateStakingPoolsDataPayload } from '@/types';

export const setStakingPoolsData = createAction<SetStakingPoolsDataPayload | void>(
  'SET_STAKING_POOLS_DATA'
);

export const updateStakingPoolsData = createAction<UpdateStakingPoolsDataPayload | void>(
  'UPDATE_STAKING_POOLS_DATA'
);
