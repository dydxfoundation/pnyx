import { RootState } from '@/store';

import {
  StakingBalancesData,
  UnclaimedRewardsData,
  WalletBalancesData,
  WithdrawBalancesData,
} from '@/types';

export const getStakingBalancesData = (state: RootState): StakingBalancesData =>
  state.balances.stakingBalancesData;

export const getUnclaimedRewardsData = (state: RootState): UnclaimedRewardsData =>
  state.balances.unclaimedRewardsData;

export const getWalletBalancesData = (state: RootState): WalletBalancesData =>
  state.balances.walletBalancesData;

export const getWithdrawBalancesData = (state: RootState): WithdrawBalancesData =>
  state.balances.withdrawBalancesData;
