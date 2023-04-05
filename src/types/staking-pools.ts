import { StakingPool } from '@/enums';

export type LiquidityPoolEpochData = {
  currentlyInBlackoutWindow?: boolean;
  lengthOfBlackoutWindow?: string;
  nextEpochDate?: string;
};

export type StakingPoolData = {
  poolSize?: string;
  rewardsPerSecond?: string;
} & LiquidityPoolEpochData;

export type StakingPoolsData = {
  [key in StakingPool]: StakingPoolData;
};

export type StakingPoolsDataState = {
  data: StakingPoolsData;
  lastPulledAt: string | undefined;
};

export type SetStakingPoolsDataPayload = {
  stakingPoolsData: StakingPoolsData;
};

export type UpdateStakingPoolsDataPayload = {
  stakingPool: StakingPool;
  data: StakingPoolData;
};
