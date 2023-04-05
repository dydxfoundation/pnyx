import WalletLink from 'walletlink';

import WalletConnectProvider from '@walletconnect/web3-provider';

import { WalletType } from '@/enums';

import { ConnectWalletOptions } from '@/types';

import { INJECTED_WALLET_FLAGS, WALLETCONNECT_MOBILE_LINKS } from '@/constants/wallets';

export const walletLinkInstance = new WalletLink({
  appName: 'dYdX',
  appLogoUrl: 'https://dydx.community/cbw-image.png',
  darkMode: false,
});

const networkId = Number(import.meta.env.VITE_NETWORK_ID);

const walletConnectBaseOptions = {
  rpc: {
    [networkId]: import.meta.env.VITE_ETHEREUM_NODE_URI || '',
  },
  bridge: import.meta.env.VITE_WALLET_CONNECT_BRIDGE_URI || '',
};

export const coinbaseWalletProvider = walletLinkInstance.makeWeb3Provider(
  import.meta.env.VITE_ETHEREUM_NODE_URI || '',
  networkId
);

let walletConnectProvider: WalletConnectProvider;
export const getWalletConnectProvider = () => walletConnectProvider;

export type ProviderByWalletTypeResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  isWalletConnect?: boolean;
  isWalletLink?: boolean;
};

export const getProviderByWalletType = ({
  walletType,
  options = {},
}: {
  walletType: WalletType;
  options?: ConnectWalletOptions;
}): ProviderByWalletTypeResponse => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ethereum, web3 } = window as unknown as {ethereum: any, web3: any};

  switch (walletType) {
    case WalletType.BitPie:
    case WalletType.CloverWallet:
    case WalletType.Coin98:
    case WalletType.HuobiWallet:
    case WalletType.ImToken:
    case WalletType.MathWallet:
    case WalletType.MetaMask:
    case WalletType.Rainbow:
    case WalletType.TokenPocket:
    case WalletType.TrustWallet: {
      const injectedWalletFlag = INJECTED_WALLET_FLAGS[walletType] ?? '';

      if (ethereum?.[injectedWalletFlag]) {
        ethereum.autoRefreshOnNetworkChange = false;
        return { provider: ethereum };
      }

      if (web3?.currentProvider?.[injectedWalletFlag]) {
        return { provider: web3.currentProvider };
      }

      // Restrict WalletConnect options to the selected wallet
      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: WALLETCONNECT_MOBILE_LINKS[walletType],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }

    case WalletType.CoinbaseWallet: {
      let provider;

      if (ethereum) {
        ethereum.autoRefreshOnNetworkChange = false;
        provider = ethereum;
      } else if (web3?.currentProvider) {
        provider = web3?.currentProvider;
      }

      // If the user is in the coinbase wallet app
      if (provider?.isCoinbaseWallet) {
        return { provider };
      }

      return { provider: coinbaseWalletProvider, isWalletLink: true };
    }

    case WalletType.OtherWallet: {
      if (ethereum) {
        ethereum.autoRefreshOnNetworkChange = false;
        return { provider: ethereum };
      }

      if (web3?.currentProvider) {
        return { provider: web3.currentProvider };
      }

      walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions);

      return { provider: walletConnectProvider, isWalletConnect: true };
    }

    case WalletType.WalletConnect: {
      walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions);

      return { provider: walletConnectProvider, isWalletConnect: true };
    }

    case WalletType.TestWallet: {
      // no provider needed, other subproviders will provide read-only data
      return { provider: undefined };
    }

    default:
      return { provider: undefined };
  }
};
