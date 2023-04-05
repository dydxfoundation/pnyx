import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { StakingBalances } from '@/types';
import { StakingPool } from '@/enums';

import { setStakingBalancesData } from '@/actions/balances';

import { getStakingBalancesData } from '@/selectors/balances';
import { getWalletAddress } from '@/selectors/wallets';

import contractClient from '@/lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const stakingBalancesPollingInterval = Number(import.meta.env.VITE_BLOCK_POLL_MS);

const stopPollingBalances = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollStakingBalances = () => {
  const dispatch = useDispatch();

  const stakingBalancesData = useSelector(getStakingBalancesData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const pollStakingBalances = async () => {
    stopPollingBalances();

    if (!walletAddress) {
      return;
    }

    try {
      const balancePromises = [];

      for (const stakingPool of Object.values(StakingPool)) {
        balancePromises.push(
          contractClient.stakingPoolClient?.getUserBalancesAndUnclaimedRewards({
            stakingPool,
            walletAddress,
          })
        );
      }

      const balancesData = await Promise.all(balancePromises);
      const balances: StakingBalances = {} as StakingBalances;

      let index = 0;
      for (const stakingPool of Object.values(StakingPool)) {
        balances[stakingPool] = balancesData[index] || {
          userBalance: undefined,
          unclaimedRewards: undefined,
        };

        index += 1;
      }

      dispatch(setStakingBalancesData({ balances }));
    } catch (error) {
      console.error(error);
    }

    pollingFunction = setTimeout(pollStakingBalances, stakingBalancesPollingInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = stakingBalancesData;

    /**
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (walletAddress) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          stakingBalancesPollingInterval
      ) {
        pollStakingBalances();
      } else {
        pollingFunction = setTimeout(pollStakingBalances, stakingBalancesPollingInterval);
      }
    } else {
      stopPollingBalances();
    }

    return () => stopPollingBalances();
  }, [walletAddress]);
};

export default usePollStakingBalances;
