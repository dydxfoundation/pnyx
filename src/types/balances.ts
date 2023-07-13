import { AssetSymbol, StakingPool } from '@/enums';

export type StakingBalances = {
  [key in StakingPool]: {
    userBalance?: string;
    unclaimedRewards?: string;
  };
};

export type StakingBalancesData = {
  balances: StakingBalances;
  lastPulledAt?: string;
};

export type SetStakingBalancesDataPayload = {
  balances: StakingBalances;
};

export type WalletBalancesData = {
  [key in AssetSymbol]: {
    balance?: string;
    lastPulledAt?: string;
  };
};

export type SetWalletBalancesDataPayload = {
  assetSymbol: AssetSymbol;
  balance?: string;
};

export type PoolWithdrawBalancesData = {
  availableWithdrawBalance?: string;
  pendingWithdrawBalance?: string;
};

export type WithdrawBalancesData = {
  [key in StakingPool]: PoolWithdrawBalancesData & {
    lastPulledAt?: string;
  };
};

export type SetWithdrawBalancesDataPayload = {
  stakingPool: StakingPool;
  data: PoolWithdrawBalancesData;
};

export type UnclaimedRewardsData = {
  unclaimedRewards?: string;
  lastPulledAt?: string;
};

export type SetUnclaimedRewardsPayload = {
  unclaimedRewards?: string;
};
