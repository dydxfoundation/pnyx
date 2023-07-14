// Note: enum values also used as string keys
export enum WalletType {
  BitKeep = 'BITKEEP',
  BitPie = 'BITPIE',
  CloverWallet = 'CLOVER_WALLET',
  CoinbaseWallet = 'COINBASE_WALLET',
  Coin98 = 'COIN98',
  HuobiWallet = 'HUOBI_WALLET',
  ImToken = 'IMTOKEN',
  MathWallet = 'MATH_WALLET',
  MetaMask = 'METAMASK',
  Rainbow = 'RAINBOW_WALLET',
  TokenPocket = 'TOKEN_POCKET',
  TrustWallet = 'TRUST_WALLET',
  WalletConnect = 'WALLET_CONNECT',
  WalletConnect2 = 'WALLET_CONNECT_2',
  TestWallet = 'TEST_WALLET',
  OtherWallet = 'OTHER_WALLET',
}

export enum WalletState {
  NOT_LOADED = 'NOT_LOADED',
  NO_WALLET = 'NO_WALLET',
  NO_ACCOUNTS = 'NO_ACCOUNTS',
  INCORRECT_NETWORK = 'INCORRECT_NETWORK',
  READY = 'READY',
  DISCONNECTED = 'DISCONNECTED',
}

export enum WalletOnboardingStates {
  LOADING = 'LOADING',
  NOT_CONNECTED = 'NOT_CONNECTED',
  INCORRECT_NETWORK = 'INCORRECT_NETWORK',
  EXISTING_USER_MISSING_KEYS = 'EXISTING_USER_MISSING_KEYS',
  NEW_USER_INCOMPLETE_ONBOARDING = 'NEW_USER_INCOMPLETE_ONBOARDING',
  COMPLETE = 'COMPLETE',
}
