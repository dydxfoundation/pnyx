import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { StakingPool } from 'enums';

import { setWithdrawBalancesData } from 'actions/balances';

import { getWithdrawBalancesData } from 'selectors/balances';
import { getWalletAddress } from 'selectors/wallets';

import contractClient from 'lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const withdrawBalancesPollingInterval = Number(process.env.REACT_APP_BLOCK_POLL_MS);

const stopPollingBalances = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollWithdrawBalances = ({ stakingPool }: { stakingPool: StakingPool }) => {
  const dispatch = useDispatch();

  const walletAddress = useSelector(getWalletAddress);
  const withdrawBalancesData = useSelector(getWithdrawBalancesData, shallowEqual);

  const pollWithdrawBalances = async () => {
    stopPollingBalances();

    if (!walletAddress) {
      return;
    }

    try {
      const newData = await contractClient.stakingPoolClient.getWithdrawBalances({
        stakingPool,
        walletAddress,
      });

      dispatch(setWithdrawBalancesData({ data: newData, stakingPool }));
    } catch (error) {
      console.error(error);
    }

    pollingFunction = setTimeout(pollWithdrawBalances, withdrawBalancesPollingInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = withdrawBalancesData[stakingPool];

    /**
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (walletAddress) {
      if (
        !lastPulledAt ||
        DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >=
          withdrawBalancesPollingInterval
      ) {
        pollWithdrawBalances();
      } else {
        pollingFunction = setTimeout(pollWithdrawBalances, withdrawBalancesPollingInterval);
      }
    } else {
      stopPollingBalances();
    }

    return () => stopPollingBalances();
  }, [walletAddress]);
};

export default usePollWithdrawBalances;
