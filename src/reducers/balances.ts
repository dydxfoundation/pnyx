import _ from 'lodash';

import { AssetSymbol, StakingPool } from '@/enums';

import {
  StakingBalancesData,
  SetStakingBalancesDataPayload,
  WalletBalancesData,
  SetWalletBalancesDataPayload,
  WithdrawBalancesData,
  SetWithdrawBalancesDataPayload,
  UnclaimedRewardsData,
  SetUnclaimedRewardsPayload,
} from '@/types';

import {
  setStakingBalancesData,
  setUnclaimedRewards,
  setWalletBalancesData,
  setWithdrawBalancesData,
} from '@/actions/balances';

import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  stakingBalancesData: StakingBalancesData;
  unclaimedRewardsData: UnclaimedRewardsData;
  walletBalancesData: WalletBalancesData;
  withdrawBalancesData: WithdrawBalancesData;
};

type Action = {
  type: string;
  payload: SetStakingBalancesDataPayload &
    SetUnclaimedRewardsPayload &
    SetWalletBalancesDataPayload &
    SetWithdrawBalancesDataPayload;
};

const initialState: State = {
  stakingBalancesData: {
    balances: {},
  } as StakingBalancesData,
  unclaimedRewardsData: {} as UnclaimedRewardsData,
  walletBalancesData: {} as WalletBalancesData,
  withdrawBalancesData: {} as WithdrawBalancesData,
};

_.forEach(StakingPool, (pool: StakingPool) => {
  initialState.stakingBalancesData.balances[pool] = {};
  initialState.withdrawBalancesData[pool] = {};
});

_.forEach(AssetSymbol, (assetSymbol: AssetSymbol) => {
  initialState.walletBalancesData[assetSymbol] = {};
});

export default function balancesReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setStakingBalancesData().type: {
      const { balances } = payload;

      return {
        ...state,
        stakingBalancesData: {
          balances,
          lastPulledAt: new Date().toISOString(),
        },
      };
    }
    case setUnclaimedRewards().type: {
      const { unclaimedRewards } = payload;

      return {
        ...state,
        unclaimedRewardsData: {
          unclaimedRewards,
          lastPulledAt: new Date().toISOString(),
        },
      };
    }
    case setWalletBalancesData().type: {
      const { assetSymbol, balance } = payload;

      return {
        ...state,
        walletBalancesData: {
          ...state.walletBalancesData,
          [assetSymbol]: {
            balance,
            lastPulledAt: new Date().toISOString(),
          },
        },
      };
    }
    case setWithdrawBalancesData().type: {
      const { stakingPool, data } = payload;

      return {
        ...state,
        withdrawBalancesData: {
          ...state.withdrawBalancesData,
          [stakingPool]: {
            ...data,
            lastPulledAt: new Date().toISOString(),
          },
        },
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
