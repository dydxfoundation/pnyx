import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { StakingPool } from '@/enums';

import { setWithdrawBalancesData } from '@/actions/balances';

import { getWithdrawBalancesData } from '@/selectors/balances';
import { getWalletAddress } from '@/selectors/wallets';

import contractClient from '@/lib/contract-client';

let isPolling: boolean = false;
let pollingFunction: ReturnType<typeof setTimeout> | null;

const withdrawBalancesPollingInterval = Number(import.meta.env.VITE_BLOCK_POLL_MS);

const stopPollingBalances = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);

    isPolling = false;
    pollingFunction = null;
  }
};

const usePollWithdrawBalances = ({ stakingPool }: { stakingPool: StakingPool }) => {
  const dispatch = useDispatch();

  const walletAddress = useSelector(getWalletAddress);
  const withdrawBalancesData = useSelector(getWithdrawBalancesData, shallowEqual);

  const [previousWalletAddress, setPreviousWalletAddress] = useState<string | undefined>();
  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const pollWithdrawBalances = async () => {
    stopPollingBalances();

    isPolling = true;

    if (walletAddress) {
      try {
        const newData = await contractClient.stakingPoolClient.getWithdrawBalances({
          stakingPool,
          walletAddress,
        });

        dispatch(setWithdrawBalancesData({ data: newData, stakingPool }));
      } catch (error) {
        console.error(error);
      }
    }

    pollingFunction = setTimeout(pollWithdrawBalances, withdrawBalancesPollingInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = withdrawBalancesData[stakingPool];

    /**
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (!isPolling && !pollingFunction) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          withdrawBalancesPollingInterval
      ) {
        pollWithdrawBalances();
      } else {
        pollingFunction = setTimeout(pollWithdrawBalances, withdrawBalancesPollingInterval);
      }

      setIsInstancePolling(true);
    }
  }, []);

  useEffect(
    () => () => {
      if (isInstancePolling) {
        stopPollingBalances();
      }
    },
    [isInstancePolling]
  );

  useEffect(() => {
    /**
     * If the wallet address changes and current instance is polling, pull new rewards immediately.
     * If the user disconnects their wallet, stop polling.
     * */
    if (isInstancePolling) {
      if (walletAddress) {
        if (previousWalletAddress !== walletAddress) {
          pollWithdrawBalances();
        }
      } else {
        stopPollingBalances();
      }
    }

    setPreviousWalletAddress(walletAddress);
  }, [walletAddress]);
};

export default usePollWithdrawBalances;
