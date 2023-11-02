import WalletLink from 'walletlink';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

import { WalletType } from '@/enums';
import { ConnectWalletOptions } from '@/types';
import { colors } from '@/styles';

import {
  INJECTED_WALLET_FLAGS,
  WALLETCONNECT1_MOBILE_LINKS,
  WALLETCONNECT2_WALLET_IDS,
} from '@/constants/wallets';

export const walletLinkInstance = new WalletLink({
  appName: 'dYdX',
  appLogoUrl: 'https://dydx.community/cbw-image.png',
  darkMode: false,
});

const networkId = Number(import.meta.env.VITE_NETWORK_ID);

const walletConnectBaseOptions = {
  bridge: import.meta.env.VITE_WALLETCONNECT1_BRIDGE_URI,
  rpc: {
    [networkId]: import.meta.env.VITE_ETHEREUM_NODE_URI || '',
  },
};

export const coinbaseWalletProvider = walletLinkInstance.makeWeb3Provider(
  import.meta.env.VITE_ETHEREUM_NODE_URI || '',
  networkId
);

const walletConnect2EthereumProviderOptions: Parameters<(typeof EthereumProvider)['init']>[0] = {
  projectId: import.meta.env.VITE_WALLETCONNECT2_PROJECT_ID!,
  chains: [networkId],
  showQrModal: true,
  qrModalOptions: {
    themeMode: 'dark' as const,
    themeVariables: {
      '--wcm-accent-color': colors.colorpurple,
      '--wcm-background-color': colors.colorpurple,
      '--wcm-z-index': '10000',
      '--wcm-font-family': '"Satoshi", system-ui, -apple-system, Helvetica, Arial, sans-serif',
    },
    enableExplorer: true,
  },
  events: ['accountsChanged', 'chainChanged'],
  metadata: {
    name: 'dYdX',
    description: '',
    url: 'https://dydx.community',
    icons: ['https://dydx.community/cbw-image.png'],
  },
};

let walletConnectProvider: WalletConnectProvider;
export const getWalletConnectProvider = () => walletConnectProvider;

let walletConnect2Provider: Awaited<ReturnType<typeof EthereumProvider.init>>;
export const getWalletConnect2Provider = () => walletConnect2Provider;

const disconnectWalletConnect2Provider = async () => {
  await walletConnect2Provider?.disconnect();
  await walletConnect2Provider?.reset();
};

export type ProviderByWalletTypeResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  walletConnectType?: WalletType.WalletConnect | WalletType.WalletConnect2;
  isWalletLink?: boolean;
};

export const getProviderByWalletType = async ({
  walletType,
  options = {},
}: {
  walletType: WalletType;
  options?: ConnectWalletOptions;
}): Promise<ProviderByWalletTypeResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ethereum, web3 } = window as unknown as { ethereum: any; web3: any };

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

      // WalletConnect 2.0
      if (WALLETCONNECT2_WALLET_IDS[walletType]) {
        try {
          await disconnectWalletConnect2Provider();
          walletConnect2Provider = await EthereumProvider.init({
            ...walletConnect2EthereumProviderOptions,
            qrModalOptions: {
              ...walletConnect2EthereumProviderOptions.qrModalOptions,
              explorerRecommendedWalletIds: [WALLETCONNECT2_WALLET_IDS[walletType]!],
              explorerExcludedWalletIds: 'ALL',
            },
          });

          return {
            provider: walletConnect2Provider,
            walletConnectType: WalletType.WalletConnect2,
          };
        } catch (error) {
          console.error(error);
        }
      }

      // WalletConnect 1.0
      // Restrict WalletConnect options to the selected wallet
      walletConnectProvider = new WalletConnectProvider({
        ...walletConnectBaseOptions,
        qrcodeModalOptions: {
          mobileLinks: WALLETCONNECT1_MOBILE_LINKS[walletType],
        },
      });

      return { provider: walletConnectProvider, walletConnectType: WalletType.WalletConnect };
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

      return { provider: walletConnectProvider, walletConnectType: WalletType.WalletConnect };
    }

    case WalletType.WalletConnect: {
      walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions);

      return { provider: walletConnectProvider, walletConnectType: WalletType.WalletConnect };
    }

    case WalletType.WalletConnect2: {
      try {
        await disconnectWalletConnect2Provider();
        walletConnect2Provider = await EthereumProvider.init(walletConnect2EthereumProviderOptions);

        return {
          provider: walletConnect2Provider,
          walletConnectType: WalletType.WalletConnect2,
        };
      } catch (e) {
        return { provider: undefined };
      }
    }

    case WalletType.TestWallet: {
      // no provider needed, other subproviders will provide read-only data
      return { provider: undefined };
    }

    default:
      return { provider: undefined };
  }
};
