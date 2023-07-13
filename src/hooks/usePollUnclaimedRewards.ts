import { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { setUnclaimedRewards } from '@/actions/balances';

import { getWalletAddress } from '@/selectors/wallets';
import { getUnclaimedRewardsData } from '@/selectors/balances';

import contractClient from '@/lib/contract-client';

let isPolling: boolean = false;
let pollingFunction: ReturnType<typeof setTimeout> | null;

const unclaimedRewardsInterval = Number(import.meta.env.VITE_DATA_POLL_MS);

const stopPollingUnclaimedRewards = () => {
  if (isPolling || pollingFunction) {
    clearTimeout(pollingFunction as ReturnType<typeof setTimeout>);

    isPolling = false;
    pollingFunction = null;
  }
};

const usePollUnclaimedRewards = () => {
  const dispatch = useDispatch();

  const unclaimedRewardsData = useSelector(getUnclaimedRewardsData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const [previousWalletAddress, setPreviousWalletAddress] = useState<string | undefined>();
  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const pollUnclaimedRewards = async () => {
    stopPollingUnclaimedRewards();

    isPolling = true;

    if (walletAddress) {
      try {
        const unclaimedRewards = await contractClient.getUnclaimedRewards({ walletAddress });
        dispatch(setUnclaimedRewards({ unclaimedRewards }));
      } catch (error) {
        console.error(error);
      }
    }

    pollingFunction = setTimeout(pollUnclaimedRewards, unclaimedRewardsInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = unclaimedRewardsData;

    /**
     * If a polling function is already active, don't poll again. If no function is active,
     * poll immediately if last pull was later than the polling interval, otherwise wait for
     * the interval before polling again.
     */
    if (!isPolling && !pollingFunction) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          unclaimedRewardsInterval
      ) {
        pollUnclaimedRewards();
      } else {
        pollingFunction = setTimeout(pollUnclaimedRewards, unclaimedRewardsInterval);
      }

      setIsInstancePolling(true);
    }
  }, []);

  useEffect(
    () => () => {
      if (isInstancePolling) {
        stopPollingUnclaimedRewards();
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
          pollUnclaimedRewards();
        }
      } else {
        stopPollingUnclaimedRewards();
      }
    }

    setPreviousWalletAddress(walletAddress);
  }, [walletAddress]);
};

export default usePollUnclaimedRewards;
