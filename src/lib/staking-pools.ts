import BigNumber from 'bignumber.js';

import { StakingPool } from '@/enums';
import { StakingBalancesData, WithdrawBalancesData } from '@/types';

import { MustBigNumber } from '@/lib/numbers';

/**
 * Normalize to $1K based on pool size and rewards per sec, then multiply by 60 * 60 * 24 to get rewards per day.
 */
export const calculateEstimatedLiquidityPoolYieldPerDay = ({
  poolSize = '0',
  rewardsPerSecond = '0',
}: {
  poolSize?: string;
  rewardsPerSecond?: string;
}): BigNumber =>
  BigNumber.min(new BigNumber(1000).div(poolSize), 1)
    .times(rewardsPerSecond)
    .times(60)
    .times(60)
    .times(24);

/**
 * Normalize based on pool size and rewards / sec and multiply by 60 * 60 * 24 * 365 to
 * get rewards per year per DYDX, then multiple by 100 to get the APR.
 */
export const calculateEstimatedSafetyPoolAPR = ({
  poolSize = '0',
  rewardsPerSecond = '0',
}: {
  poolSize?: string;
  rewardsPerSecond?: string;
}): BigNumber =>
  MustBigNumber(rewardsPerSecond)
    .div(BigNumber.max(poolSize, 1))
    .times(60)
    .times(60)
    .times(24)
    .times(365)
    .times(100);

export const calculateUserStakingBalance = ({
  stakingBalancesData,
  stakingPool,
  withdrawBalancesData,
}: {
  stakingBalancesData: StakingBalancesData;
  stakingPool: StakingPool;
  withdrawBalancesData: WithdrawBalancesData;
}): BigNumber | undefined => {
  const { userBalance } = stakingBalancesData.balances[stakingPool];
  const { availableWithdrawBalance } = withdrawBalancesData[stakingPool];

  if (userBalance && availableWithdrawBalance) {
    return MustBigNumber(userBalance).minus(availableWithdrawBalance || 0);
  }

  return undefined;
};
