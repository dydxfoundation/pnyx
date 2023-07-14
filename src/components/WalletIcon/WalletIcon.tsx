import React from 'react';

import { WalletType } from '@/enums';

import {
  BitKeepIcon,
  BitPieIcon,
  CloverWalletIcon,
  CoinbaseWalletIcon,
  Coin98Icon,
  GenericWalletIcon,
  HuobiWalletIcon,
  ImTokenIcon,
  MathWalletIcon,
  MetaMaskIcon,
  RainbowWalletIcon,
  TestWalletIcon,
  TrustWalletIcon,
  TokenPocketIcon,
  WalletConnectIcon,
} from '@/icons';

const WALLET_ICONS: Record<WalletType, string | React.FC> = {
  [WalletType.BitKeep]: BitKeepIcon,
  [WalletType.BitPie]: BitPieIcon,
  [WalletType.CloverWallet]: CloverWalletIcon,
  [WalletType.CoinbaseWallet]: CoinbaseWalletIcon,
  [WalletType.Coin98]: Coin98Icon,
  [WalletType.HuobiWallet]: HuobiWalletIcon,
  [WalletType.ImToken]: ImTokenIcon,
  [WalletType.MathWallet]: MathWalletIcon,
  [WalletType.MetaMask]: MetaMaskIcon,
  [WalletType.OtherWallet]: GenericWalletIcon,
  [WalletType.Rainbow]: RainbowWalletIcon,
  [WalletType.TestWallet]: TestWalletIcon,
  [WalletType.TrustWallet]: TrustWalletIcon,
  [WalletType.TokenPocket]: TokenPocketIcon,
  [WalletType.WalletConnect]: WalletConnectIcon,
  [WalletType.WalletConnect2]: WalletConnectIcon,
};

export const WalletIcon: React.FC<{ walletType: WalletType }> = ({ walletType }) => {
  const Icon = WALLET_ICONS[walletType];

  if (!Icon) {
    throw new Error('Unsupported walletType');
  }

  if (typeof Icon === 'string') return <img src={Icon} alt="" />;

  return <Icon />;
};

export default WalletIcon;

export type WalletIconProps = {
  walletType: WalletType;
};
