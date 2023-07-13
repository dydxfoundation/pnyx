import { WalletType } from '@/enums';

export type ConnectWalletOptions =
  | {
      derivationPath?: string;
      walletAddress?: string;
    }
  | undefined;

export type ConnectWalletPayload = {
  walletType: WalletType;
  autoReconnect?: boolean;
  options?: ConnectWalletOptions;
};

export type WalletLoadedPayload = {
  accounts: string[];
  networkId?: number;
};

export type DisconnectWalletPayload = {
  walletType?: WalletType;
};

export type UserAccountChangedPayload = {
  accounts: string[];
};

export type NetworkIdChangedPayload = {
  networkId: number;
};
