import _ from 'lodash';
import { Middleware } from 'redux';

import { ExternalLink, WalletType } from '@/enums';
import { RootState } from '@/store';

import {
  connectWallet,
  walletLoaded,
  disconnectWallet,
  userAccountChanged,
  networkIdChanged,
} from '@/actions/wallets';

import { pageLoaded } from '@/actions/page';

import { getPageViewport } from '@/selectors/page';

import {
  getProviderByWalletType,
  getWalletConnectProvider,
  walletLinkInstance,
} from '@/lib/wallet-connection';

import contractClient from '@/lib/contract-client';
import { getLocalStorage, removeLocalStorage, LOCAL_STORAGE_KEYS } from '@/lib/local-storage';

const walletConnectionMiddleware: Middleware<{}, RootState> = (store) => (next) => async (
  action
) => {
  next(action);

  const { type, payload } = action;

  if (type === pageLoaded().type) {
    const lastWalletUsed = getLocalStorage({ key: LOCAL_STORAGE_KEYS.LAST_WALLET_USED });

    // Don't reconnect Coinbase Wallet, this just results in infinite loading.
    if (lastWalletUsed && lastWalletUsed !== WalletType.CoinbaseWallet) {
      store.dispatch(connectWallet({ walletType: lastWalletUsed, autoReconnect: true }));
    }
  } else if (type === connectWallet().type) {
    const { walletType, options, autoReconnect } = payload;

    const { provider, isWalletConnect, isWalletLink } = getProviderByWalletType({
      walletType,
      options,
    });

    if (!provider) {
      return;
    }

    const state = store.getState();
    const pageViewport = getPageViewport(state);

    if (isWalletConnect) {
      try {
        await provider.enable();
      } catch (e) {
        if (
          _.includes(e.message, 'User closed WalletConnect modal') ||
          _.includes(e.message, 'User closed modal')
        ) {
          store.dispatch(disconnectWallet({ walletType }));
        }

        return;
      }
    } else if (walletType === WalletType.CoinbaseWallet) {
      // WalletLink doesn't work on mobile, send the user to the Coinbase Wallet
      // download page if the user isn't access the page from the Coinbase Wallet browser.
      if (isWalletLink && pageViewport.isTablet) {
        window.open(ExternalLink.CoinbaseSignup, '_blank');
      } else {
        try {
          await provider.request({ method: 'eth_requestAccounts' });
        } catch (e) {
          if (_.includes(e.message, 'User denied account authorization')) {
            store.dispatch(disconnectWallet({ walletType }));
          }

          return;
        }
      }
    } else if (!autoReconnect) {
      // Don't pop wallet login on auto reconnect if it's locked, let the user click
      // the 'Connect wallet' button again.
      try {
        await provider.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        if (_.includes(e.message, 'User rejected the request')) {
          store.dispatch(disconnectWallet({ walletType }));
        }

        return;
      }
    }

    // Set callbacks for accounts/network changing for providers that support EIP 1193.
    if (provider.on) {
      provider.on('accountsChanged', (newAccounts: string[]) =>
        store.dispatch(userAccountChanged({ accounts: newAccounts }))
      );

      provider.on('chainChanged', (networkId: number | string) =>
        store.dispatch(networkIdChanged({ networkId: Number(networkId) }))
      );
    }

    contractClient.injectProvider({ provider });
    const { networkId, accounts } = await contractClient.getNetworkIdAndAccounts();

    store.dispatch(walletLoaded({ accounts, networkId }));

    return;
  }

  if (type === disconnectWallet().type) {
    removeLocalStorage({ key: LOCAL_STORAGE_KEYS.LAST_WALLET_USED });

    const { walletType } = payload || {};

    if (walletType === WalletType.CoinbaseWallet) {
      await walletLinkInstance.disconnect();
    } else {
      const walletConnectProvider = getWalletConnectProvider();

      if (walletConnectProvider && walletConnectProvider.disconnect) {
        walletConnectProvider.qrcode = false;
        await walletConnectProvider.disconnect();
      }
    }
  }
};

export default walletConnectionMiddleware;
