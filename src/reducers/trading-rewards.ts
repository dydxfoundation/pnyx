import { SetTradingRewardsDataPayload, TradingRewardsData } from '@/types';

import { setTradingRewardsData } from '@/actions/trading-rewards';
import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  tradingRewardsData: TradingRewardsData | null;
};

type Action = {
  type: string;
  payload: SetTradingRewardsDataPayload;
};

const initialState: State = {
  tradingRewardsData: null,
};

export default function tradingRewardsReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setTradingRewardsData().type: {
      return {
        ...state,
        tradingRewardsData: payload?.tradingRewardsData,
      };
    }
    case userAccountChanged().type:
    case disconnectWallet().type: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
}
