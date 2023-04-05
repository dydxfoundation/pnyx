import { RootState } from '@/store';
import { WalletType } from '@/enums';

export const getWalletType = (state: RootState): WalletType | null => state.wallets.walletType;

export const getWalletAddress = (state: RootState): string | undefined =>
  state.wallets.accounts?.[0];

export const getWalletNetworkId = (state: RootState): number | null => state.wallets.networkId;

export const getIsWalletConnecting = (state: RootState): boolean =>
  state.wallets.isWalletConnecting;

export const getIsWalletIncorrectNetwork = (state: RootState): boolean =>
  getWalletNetworkId(state) !== Number(import.meta.env.VITE_NETWORK_ID);
