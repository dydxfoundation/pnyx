import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { setGovernancePowersData } from '@/actions/governance';

import { getGovernancePowersData } from '@/selectors/governance';
import { getWalletAddress } from '@/selectors/wallets';

import contractClient from '@/lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const governancePowersPollingInterval = Number(import.meta.env.VITE_DATA_POLL_MS);

const stopPollingGovernancePowersData = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollGovernancePowersData = () => {
  const dispatch = useDispatch();

  const governancePowersData = useSelector(getGovernancePowersData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const pollGovernancePowersData = async () => {
    stopPollingGovernancePowersData();

    if (!walletAddress) {
      return;
    }

    try {
      const governancePowers = await contractClient.governanceClient.getUserGovernancePowers({
        walletAddress,
      });

      const delegatees = await contractClient.governanceClient.getUserGovernanceDelegatees({
        walletAddress,
      });

      dispatch(setGovernancePowersData({ ...governancePowers, delegatees }));
    } catch (error) {
      console.error(error);
    }

    pollingFunction = setTimeout(pollGovernancePowersData, governancePowersPollingInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = governancePowersData;

    /**
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (walletAddress) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          governancePowersPollingInterval
      ) {
        pollGovernancePowersData();
      } else {
        pollingFunction = setTimeout(pollGovernancePowersData, governancePowersPollingInterval);
      }
    } else {
      stopPollingGovernancePowersData();
    }

    return () => stopPollingGovernancePowersData();
  }, [walletAddress]);
};

export default usePollGovernancePowersData;
