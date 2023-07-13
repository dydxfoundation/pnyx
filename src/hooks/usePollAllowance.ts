import { useEffect } from 'react';
import { DateTime } from 'luxon';

import { AllowancesState, SetAllowancePayload } from '@/types';
import { StakingPool } from '@/enums';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';

let pollingFunction: ReturnType<typeof setTimeout> | null;
let previousWalletAddress: string;

const allowancePollingInterval = Number(import.meta.env.VITE_BLOCK_POLL_MS);

const stopPollingAllowance = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollAllowance = ({
  allowances,
  setAllowance,
  stakingPool,
  walletAddress,
}: {
  allowances: AllowancesState;
  setAllowance: (payload: SetAllowancePayload) => void;
  stakingPool: StakingPool;
  walletAddress: string;
}) => {
  const fetchAllowance = async () => {
    stopPollingAllowance();

    try {
      const allowance = await contractClient.stakingPoolClient?.getAllowance({
        stakingPool,
        walletAddress: walletAddress as string,
      });

      setAllowance({ stakingPool, allowance });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const { allowance, lastPulledAt } = allowances[stakingPool];

    /**
     * If the wallet address changes, poll new allowances immediately.
     * If current allowance has already been set, don't poll.
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (walletAddress && previousWalletAddress !== walletAddress) {
      fetchAllowance();
    } else if (MustBigNumber(allowance).lte(0)) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          allowancePollingInterval
      ) {
        fetchAllowance();
      } else {
        pollingFunction = setTimeout(fetchAllowance, allowancePollingInterval);
      }
    } else {
      stopPollingAllowance();
    }

    previousWalletAddress = walletAddress;

    return () => stopPollingAllowance();
  }, [allowances, walletAddress]);
};

export default usePollAllowance;
