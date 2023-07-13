import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { StakingPoolsData } from '@/types';
import { StakingPool } from '@/enums';

import { setStakingPoolsData } from '@/actions/staking-pools';
import { getStakingPoolsData } from '@/selectors/staking-pools';

import contractClient from '@/lib/contract-client';

let pollingFunction: ReturnType<typeof setTimeout> | null;

const stakingPoolsDataInterval = Number(import.meta.env.VITE_DATA_POLL_MS);

const stopPollingStakingPoolsData = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollStakingPoolsData = () => {
  const dispatch = useDispatch();
  const stakingPoolsData = useSelector(getStakingPoolsData, shallowEqual);

  const pollStakingPoolsData = async () => {
    stopPollingStakingPoolsData();

    const poolDataPromises = [];

    for (const stakingPool of Object.values(StakingPool)) {
      poolDataPromises.push(contractClient.stakingPoolClient?.getPoolData({ stakingPool }));
    }

    const poolsDataResponses = await Promise.all(poolDataPromises);
    const newStakingPoolsData: StakingPoolsData = {} as StakingPoolsData;

    let index = 0;
    for (const stakingPool of Object.values(StakingPool)) {
      newStakingPoolsData[stakingPool] = poolsDataResponses[index] || {
        poolSize: undefined,
        rewardsPerSecond: undefined,
      };

      index += 1;
    }

    dispatch(setStakingPoolsData({ stakingPoolsData: newStakingPoolsData }));

    pollingFunction = setTimeout(pollStakingPoolsData, stakingPoolsDataInterval);
  };

  useEffect(() => {
    const { lastPulledAt } = stakingPoolsData;

    /**
     * Poll immediately if last pull was later than the polling interval, otherwise
     * wait for the interval before polling again.
     */
    if (
      !lastPulledAt ||
      DateTime.local().diff(DateTime.fromISO(lastPulledAt)).milliseconds >= stakingPoolsDataInterval
    ) {
      pollStakingPoolsData();
    } else {
      pollingFunction = setTimeout(pollStakingPoolsData, stakingPoolsDataInterval);
    }

    return () => stopPollingStakingPoolsData();
  }, []);
};

export default usePollStakingPoolsData;
