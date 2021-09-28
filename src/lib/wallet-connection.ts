import WalletLink from 'walletlink';

import WalletConnectProvider from '@walletconnect/web3-provider';
import { IWalletConnectProviderOptions } from '@walletconnect/types';

import { WalletType } from 'enums';
import { ConnectWalletOptions } from 'types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export const walletLinkInstance: WalletLink = new WalletLink({
  appName: 'dYdX',
  appLogoUrl: 'https://dydx.community/cbw-image.png',
  darkMode: false,
});

const networkId: number = Number(process.env.REACT_APP_NETWORK_ID);

const walletConnectBaseOptions: IWalletConnectProviderOptions = {
  rpc: {
    [networkId]: process.env.REACT_APP_ETHEREUM_NODE_URI || '',
  },
  bridge: process.env.REACT_APP_WALLET_CONNECT_BRIDGE_URI,
};

export const coinbaseWalletProvider = walletLinkInstance.makeWeb3Provider(
  process.env.REACT_APP_ETHEREUM_NODE_URI || '',
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
  switch (walletType) {
    case WalletType.CoinbaseWallet: {
      let provider;
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        provider = window.ethereum;
      } else if (window.web3 && window.web3.currentProvider) {
        provider = window.web3.currentProvider;
      }

      // If the user is in the coinbase wallet app
      if (provider && provider.isCoinbaseWallet) {
        return { provider };
      }

      return { provider: coinbaseWalletProvider, isWalletLink: true };
    }
    case WalletType.ImToken: {
      if (window.ethereum && window.ethereum.isImToken) {
        return { provider: window.ethereum };
      }

      if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isImToken) {
        return { provider: window.web3.currentProvider };
      }

      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: ['imtoken'],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.MetaMask: {
      if (window.ethereum && window.ethereum.isMetaMask) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        return { provider: window.ethereum };
      }

      if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isMetaMask) {
        return { provider: window.web3.currentProvider };
      }

      // Restrict WalletConnect options to MetaMask
      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: ['metamask'],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.OtherWallet: {
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        return { provider: window.ethereum };
      }

      if (window.web3 && window.web3.currentProvider) {
        return { provider: window.web3.currentProvider };
      }

      walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions);

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.Rainbow: {
      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: ['rainbow'],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.TokenPocket: {
      if (window.ethereum && window.ethereum.isTokenPocket) {
        return { provider: window.ethereum };
      }

      if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTokenPocket) {
        return { provider: window.web3.currentProvider };
      }

      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: ['tokenpocket'],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.TrustWallet: {
      if (window.ethereum && window.ethereum.isTrustWallet) {
        return { provider: window.ethereum };
      }

      if (window.web3 && window.web3.currentProvider && window.web3.currentProvider.isTrustWallet) {
        return { provider: window.web3.currentProvider };
      }

      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: ['trust'],
        },
      });

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    case WalletType.WalletConnect: {
      walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions);

      return { provider: walletConnectProvider, isWalletConnect: true };
    }
    default:
      break;
  }

  return { provider: null };
};
