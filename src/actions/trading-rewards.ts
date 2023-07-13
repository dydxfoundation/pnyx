import { createAction } from 'redux-actions';
import { SetTradingRewardsDataPayload } from '@/types';

export const setTradingRewardsData = createAction<SetTradingRewardsDataPayload | void>(
  'SET_TRADING_REWARDS_DATA'
);
