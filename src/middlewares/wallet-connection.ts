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

import contractClient from '@/lib/contract-client';

import {
  getProviderByWalletType,
  getWalletConnectProvider,
  getWalletConnect2Provider,
  walletLinkInstance,
} from '@/lib/wallet-connection';

import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
  LOCAL_STORAGE_KEYS,
} from '@/lib/local-storage';

const walletConnectionMiddleware: Middleware<{}, RootState> =
  (store) => (next) => async (action) => {
    next(action);

    const { type, payload } = action;

    if (type === pageLoaded().type) {
      const lastWalletUsed = getLocalStorage({ key: LOCAL_STORAGE_KEYS.LAST_WALLET_USED });

      // Don't reconnect Coinbase Wallet, this just results in infinite loading.
      if (
        lastWalletUsed &&
        lastWalletUsed !== WalletType.CoinbaseWallet &&
        lastWalletUsed !== WalletType.WalletConnect2
      ) {
        store.dispatch(connectWallet({ walletType: lastWalletUsed, autoReconnect: true }));
      }
    } else if (type === connectWallet().type) {
      const { walletType, options, autoReconnect } = payload;

      const { provider, walletConnectType, isWalletLink } = await getProviderByWalletType({
        walletType,
        options,
      });

      if (!provider) {
        return;
      }

      const state = store.getState();
      const pageViewport = getPageViewport(state);

      if (walletConnectType === WalletType.WalletConnect) {
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
      } else if (walletConnectType === WalletType.WalletConnect2) {
        try {
          await provider.enable();

          if (
            !(
              provider.connected &&
              provider.session?.topic ===
                getLocalStorage({ key: LOCAL_STORAGE_KEYS.WALLETCONNECT2_SESSION_TOPIC })
            )
          ) {
            const session = provider.session;

            setLocalStorage({
              key: LOCAL_STORAGE_KEYS.WALLETCONNECT2_SESSION_TOPIC,
              value: session.topic,
            });
          }
        } catch (e) {
          if (_.includes(e.message, 'Connection request reset.')) {
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

        const walletConnect2Provider = getWalletConnect2Provider();
        await walletConnect2Provider?.disconnect();
        await walletConnect2Provider?.reset();
      }
    }
  };

export default walletConnectionMiddleware;
