import { WalletType } from 'enums/wallets';

export const DISPLAYED_WALLETS = [
  WalletType.ImToken,
  WalletType.MetaMask,
  WalletType.CoinbaseWallet,
  WalletType.TrustWallet,
  WalletType.Rainbow,
  WalletType.HuobiWallet,
  // WalletType.CloverWallet,
  // WalletType.Coin98,
  WalletType.TokenPocket,
  // WalletType.BitPie,
  WalletType.WalletConnect,
  WalletType.OtherWallet,
];

export const INJECTED_WALLET_FLAGS: Partial<Record<WalletType, string>> = {
  [WalletType.BitPie]: 'isBitpie',
  [WalletType.CloverWallet]: 'isClover',
  [WalletType.Coin98]: 'isCoin98',
  [WalletType.HuobiWallet]: 'isHbWallet',
  [WalletType.ImToken]: 'isImToken',
  [WalletType.MathWallet]: 'isMathWallet',
  [WalletType.MetaMask]: 'isMetaMask',
  [WalletType.Rainbow]: 'isRainbowWallet',
  [WalletType.TokenPocket]: 'isTokenPocket',
  [WalletType.TrustWallet]: 'isTrust',
};

export const WALLETCONNECT_MOBILE_LINKS: Partial<Record<WalletType, string[]>> = {
  [WalletType.BitPie]: ['bitpie'],
  // [WalletType.CloverWallet]: [],
  [WalletType.Coin98]: ['coin98'],
  [WalletType.HuobiWallet]: ['huobi'],
  [WalletType.ImToken]: ['imtoken'],
  [WalletType.MathWallet]: ['math'],
  [WalletType.MetaMask]: ['metamask'],
  [WalletType.Rainbow]: ['rainbow'],
  [WalletType.TokenPocket]: ['tokenpocket'],
  [WalletType.TrustWallet]: ['trust'],
};
