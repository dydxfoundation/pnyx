import { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { setUnclaimedRewards } from 'actions/balances';

import { getWalletAddress } from 'selectors/wallets';
import { getUnclaimedRewardsData } from 'selectors/balances';

import contractClient from 'lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const unclaimedRewardsInterval = Number(process.env.REACT_APP_DATA_POLL_MS);

const stopPollingUnclaimedRewards = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollUnclaimedRewards = () => {
  const [previousWalletAddress, setPreviousWalletAddress] = useState<string | undefined>();
  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const dispatch = useDispatch();

  const unclaimedRewardsData = useSelector(getUnclaimedRewardsData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const pollUnclaimedRewards = async () => {
    stopPollingUnclaimedRewards();

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
    if (!pollingFunction) {
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
    /** If the wallet address changes and current instance is polling, pull new rewards immediately. */
    if (isInstancePolling && walletAddress && previousWalletAddress !== walletAddress) {
      pollUnclaimedRewards();
    }

    setPreviousWalletAddress(walletAddress);
  }, [walletAddress]);
};

export default usePollUnclaimedRewards;
