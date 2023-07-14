import { WalletType } from '@/enums';

export const DISPLAYED_WALLETS = [
  WalletType.MetaMask,
  WalletType.ImToken,
  WalletType.CoinbaseWallet,
  WalletType.TrustWallet,
  WalletType.Rainbow,
  WalletType.HuobiWallet,
  // WalletType.CloverWallet,
  WalletType.BitKeep,
  WalletType.Coin98,
  WalletType.TokenPocket,
  // WalletType.BitPie,
  WalletType.WalletConnect2,
  WalletType.WalletConnect,
  WalletType.OtherWallet,
];

export const INJECTED_WALLET_FLAGS: Partial<Record<WalletType, string>> = {
  [WalletType.BitKeep]: 'isBitKeep', // isBitKeepChrome, isBitEthereum
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

export const WALLETCONNECT1_MOBILE_LINKS: Partial<Record<WalletType, string[]>> = {
  [WalletType.BitKeep]: ['bitkeep'],
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

export const WALLETCONNECT2_WALLET_IDS: Partial<Record<WalletType, string>> = {
  [WalletType.BitKeep]: '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
  [WalletType.Coin98]: '2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01',
  [WalletType.HuobiWallet]: '797c615e2c556b610c048eb35535f212c0dd58de5d03e763120e90a7d1350a77',
  [WalletType.ImToken]: 'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
  [WalletType.MathWallet]: '7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26',
  [WalletType.MetaMask]: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  [WalletType.Rainbow]: '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
  [WalletType.TokenPocket]: '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
  [WalletType.TrustWallet]: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
};
