import { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { AssetSymbol } from '@/enums';

import { setWalletBalancesData } from '@/actions/balances';

import { getWalletAddress } from '@/selectors/wallets';
import { getWalletBalancesData } from '@/selectors/balances';

import contractClient from '@/lib/contract-client';

/**
 * Since polling can happen for multiple assets, store a mapping of polling functions
 * and isPolling flags.
 */
const isPollingFlags: {
  [key in AssetSymbol]?: boolean;
} = {};

const pollingFunctions: {
  [key in AssetSymbol]?: ReturnType<typeof setTimeout> | null;
} = {};

const walletBalancePollingInterval = Number(import.meta.env.VITE_BLOCK_POLL_MS);

const usePollWalletBalances = ({ assetSymbol }: { assetSymbol: AssetSymbol }) => {
  const dispatch = useDispatch();

  const walletAddress = useSelector(getWalletAddress);
  const walletBalancesData = useSelector(getWalletBalancesData, shallowEqual);

  const [previousWalletAddress, setPreviousWalletAddress] = useState<string | undefined>();
  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const stopPollingWalletBalances = () => {
    if (isPollingFlags[assetSymbol] || pollingFunctions[assetSymbol]) {
      clearTimeout(pollingFunctions[assetSymbol] as ReturnType<typeof setTimeout>);

      isPollingFlags[assetSymbol] = false;
      pollingFunctions[assetSymbol] = null;
    }
  };

  const pollWalletBalances = async () => {
    stopPollingWalletBalances();

    isPollingFlags[assetSymbol] = true;

    if (walletAddress) {
      try {
        const balance = await contractClient.getWalletBalance({
          assetSymbol,
          walletAddress,
        });

        dispatch(setWalletBalancesData({ assetSymbol, balance }));
      } catch (error) {
        console.error(error);
      }
    }

    pollingFunctions[assetSymbol] = setTimeout(pollWalletBalances, walletBalancePollingInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = walletBalancesData[assetSymbol];

    /**
     * If a polling function is already active, don't poll again. If no function is active, poll
     * immediately if last pull was later than the polling interval, otherwise wait for the interval
     * before polling again.
     */
    if (!isPollingFlags[assetSymbol]) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          walletBalancePollingInterval
      ) {
        pollWalletBalances();
      } else {
        pollingFunctions[assetSymbol] = setTimeout(
          pollWalletBalances,
          walletBalancePollingInterval
        );
      }

      setIsInstancePolling(true);
    }
  }, []);

  useEffect(
    () => () => {
      if (isInstancePolling) {
        stopPollingWalletBalances();
      }
    },
    [isInstancePolling]
  );

  useEffect(() => {
    /** If the wallet address changes and current instance is polling, pull new balances immediately. */
    if (isInstancePolling && walletAddress && previousWalletAddress !== walletAddress) {
      stopPollingWalletBalances();
      pollWalletBalances();
    }

    setPreviousWalletAddress(walletAddress);
  }, [walletAddress]);
};

export default usePollWalletBalances;
