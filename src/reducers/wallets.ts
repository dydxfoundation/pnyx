import { WalletType } from '@/enums';

import {
  ConnectWalletPayload,
  WalletLoadedPayload,
  DisconnectWalletPayload,
  UserAccountChangedPayload,
  NetworkIdChangedPayload,
} from '@/types';

import {
  walletLoaded,
  userAccountChanged,
  disconnectWallet,
  connectWallet,
  networkIdChanged,
} from '@/actions/wallets';

type State = {
  accounts: string[];
  isWalletConnecting: boolean;
  walletType: WalletType | null;
  networkId: number | null;
};

type Action = {
  type: string;
  payload: ConnectWalletPayload &
    WalletLoadedPayload &
    DisconnectWalletPayload &
    UserAccountChangedPayload &
    NetworkIdChangedPayload;
};

const initialState: State = {
  accounts: [],
  isWalletConnecting: false,
  walletType: null,
  networkId: null,
};

export default function walletReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case connectWallet().type: {
      return {
        ...state,
        walletType: payload.walletType,
        isWalletConnecting: true,
      };
    }
    case walletLoaded().type: {
      const { accounts, networkId } = payload;
      return { ...state, accounts, networkId, isWalletConnecting: false };
    }
    case disconnectWallet().type: {
      return {
        ...initialState,
      };
    }
    case userAccountChanged().type: {
      const { accounts } = payload;
      return {
        ...initialState,
        accounts,
        networkId: state.networkId,
        walletType: state.walletType,
      };
    }
    case networkIdChanged().type: {
      return {
        ...state,
        networkId: payload.networkId,
      };
    }
    default: {
      return state;
    }
  }
}
