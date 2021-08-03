import { WalletType } from 'enums';

export const WALLET_PRIORITY = [
  WalletType.MetaMask,
  WalletType.ImToken,
  WalletType.CoinbaseWallet,
  WalletType.TrustWallet,
  WalletType.Rainbow,
  WalletType.TokenPocket,
  WalletType.WalletConnect,
  WalletType.OtherWallet,
];

export const WALLET_NAMES: { [key in WalletType]: string } = {
  [WalletType.CoinbaseWallet]: 'Coinbase Wallet',
  [WalletType.ImToken]: 'imToken',
  [WalletType.MetaMask]: 'MetaMask',
  [WalletType.OtherWallet]: 'Other',
  [WalletType.Rainbow]: 'Rainbow',
  [WalletType.TokenPocket]: 'TokenPocket',
  [WalletType.TrustWallet]: 'Trust',
  [WalletType.WalletConnect]: 'WalletConnect',
};
