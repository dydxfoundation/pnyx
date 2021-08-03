import React from 'react';

import { WalletType } from 'enums';

import {
  CoinbaseWalletIcon,
  GenericWalletIcon,
  ImTokenIcon,
  MetaMaskIcon,
  RainbowIcon,
  TokenPocketIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from 'icons';

export type WalletIconProps = {
  walletType: WalletType;
};

const WalletIcon: React.FC<WalletIconProps> = ({ walletType }) => {
  let Icon;

  switch (walletType) {
    case WalletType.CoinbaseWallet: {
      Icon = CoinbaseWalletIcon;
      break;
    }
    case WalletType.ImToken: {
      Icon = ImTokenIcon;
      break;
    }
    case WalletType.MetaMask: {
      Icon = MetaMaskIcon;
      break;
    }
    case WalletType.OtherWallet: {
      Icon = GenericWalletIcon;
      break;
    }
    case WalletType.Rainbow: {
      Icon = RainbowIcon;
      break;
    }
    case WalletType.TokenPocket: {
      Icon = TokenPocketIcon;
      break;
    }
    case WalletType.TrustWallet: {
      Icon = TrustWalletIcon;
      break;
    }
    case WalletType.WalletConnect: {
      Icon = WalletConnectIcon;
      break;
    }
    default: {
      throw new Error('Unsupported walletType');
    }
  }

  return <Icon />;
};

export default WalletIcon;
