import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import { UnclaimedRewardsData, SetUnclaimedRewardsPayload } from 'types';

import contractClient from 'lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const unclaimedRewardsInterval = Number(process.env.REACT_APP_DATA_POLL_MS);

const stopPollingUnclaimedRewards = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollUnclaimedRewards = ({
  unclaimedRewardsData,
  setUnclaimedRewards,
  walletAddress,
}: {
  unclaimedRewardsData: UnclaimedRewardsData;
  setUnclaimedRewards: (payload: SetUnclaimedRewardsPayload) => void;
  walletAddress: string;
}) => {
  const [previousWalletAddress, setPreviousWalletAddress] = useState<string | undefined>();
  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const pollUnclaimedRewards = async () => {
    stopPollingUnclaimedRewards();

    if (walletAddress) {
      try {
        const unclaimedRewards = await contractClient.getUnclaimedRewards({ walletAddress });
        setUnclaimedRewards({ unclaimedRewards });
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
