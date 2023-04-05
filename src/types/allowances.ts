import { StakingPool } from '@/enums';

export type AllowancesState = {
  [key in StakingPool]: {
    allowance?: string;
    lastPulledAt?: string;
    userSentAllowanceTransaction?: boolean;
  };
};

export type SetAllowancePayload = {
  stakingPool: StakingPool;
  allowance?: string;
};

export type SetUserSentAllowanceTransactionPayload = {
  stakingPool: StakingPool;
};
