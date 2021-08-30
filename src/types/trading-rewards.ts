export type SetTradingRewardsDataPayload = {
  tradingRewardsData: TradingRewardsData;
};

export type TradingRewardsData = {
  claimedRewards: string;
  epochData: {
    currentEpoch: number;
    endOfEpochTimestamp: number;
    epochLength: number;
    startOfEpochTimestamp: number;
    waitingPeriodLength: number;
  };
  newPendingRootRewards: string;
  pendingRootData: {
    hasPendingRoot: boolean;
    waitingPeriodEnd: number;
  };
  rewardsPerEpoch: {
    [key: number]: string;
  };
};
