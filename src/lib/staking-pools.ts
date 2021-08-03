import BigNumber from 'bignumber.js';

import { StakingPool } from 'enums';
import { StakingBalancesData, WithdrawBalancesData } from 'types';

import { MustBigNumber } from 'lib/numbers';

/**
 * Normalize based on pool size and rewards / sec, then multiply by 60 * 60 * 24 to get rewards / day.
 */
export const calculateEstimatedLiquidityPoolYieldPerDay = ({
  poolSize = '0',
  rewardsPerSecond = '0',
}: {
  poolSize?: string;
  rewardsPerSecond?: string;
}) =>
  BigNumber.min(new BigNumber(1000).div(poolSize), 1)
    .times(rewardsPerSecond)
    .times(60)
    .times(60)
    .times(24);

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
