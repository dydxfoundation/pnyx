import { createAction } from 'redux-actions';

import {
  SetStakingBalancesDataPayload,
  SetUnclaimedRewardsPayload,
  SetWalletBalancesDataPayload,
  SetWithdrawBalancesDataPayload,
} from '@/types';

export const setStakingBalancesData = createAction<SetStakingBalancesDataPayload | void>(
  'SET_STAKING_BALANCES_DATA'
);

export const setWalletBalancesData = createAction<SetWalletBalancesDataPayload | void>(
  'SET_WALLET_BALANCES_DATA'
);

export const setWithdrawBalancesData = createAction<SetWithdrawBalancesDataPayload | void>(
  'SET_WITHDRAW_BALANCES_DATA'
);

export const setUnclaimedRewards = createAction<SetUnclaimedRewardsPayload | void>(
  'SET_UNCLAIMED_REWARDS'
);
