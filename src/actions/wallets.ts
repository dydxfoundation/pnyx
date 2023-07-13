import { createAction } from 'redux-actions';

import {
  ConnectWalletPayload,
  WalletLoadedPayload,
  DisconnectWalletPayload,
  NetworkIdChangedPayload,
  UserAccountChangedPayload,
} from '@/types';

export const connectWallet = createAction<ConnectWalletPayload | void>('CONNECT_WALLET');
export const disconnectWallet = createAction<DisconnectWalletPayload | void>('DISCONNECT_WALLET');

export const walletLoaded = createAction<WalletLoadedPayload | void>('WALLET_LOADED');
export const userAccountChanged = createAction<UserAccountChangedPayload | void>(
  'USER_ACCOUNT_CHANGED'
);
export const networkIdChanged = createAction<NetworkIdChangedPayload | void>('NETWORK_ID_CHANGED');
