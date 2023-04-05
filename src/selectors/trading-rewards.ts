import { RootState } from '@/store';
import { TradingRewardsData } from '@/types';

export const getTradingRewardsData = (state: RootState): TradingRewardsData | null =>
  state.tradingRewards.tradingRewardsData;
