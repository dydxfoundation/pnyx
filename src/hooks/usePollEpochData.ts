import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { StakingPool } from '@/enums';

import { updateStakingPoolsData } from '@/actions/staking-pools';
import { getStakingPoolsData } from '@/selectors/staking-pools';

import contractClient from '@/lib/contract-client';

const epochDataPollingInterval = Number(import.meta.env.VITE_COUNTDOWN_POLL_MS);

let pollingFunction: ReturnType<typeof setTimeout> | null;

const stopPollingEpochData = () => {
  if (pollingFunction) {
    clearTimeout(pollingFunction);
    pollingFunction = null;
  }
};

const usePollEpochData = ({ stakingPool }: { stakingPool: StakingPool }) => {
  const dispatch = useDispatch();
  const stakingPoolsData = useSelector(getStakingPoolsData, shallowEqual);

  const [isInstancePolling, setIsInstancePolling] = useState<boolean>(false);

  const {
    currentlyInBlackoutWindow,
    lengthOfBlackoutWindow,
    nextEpochDate,
  } = stakingPoolsData.data[stakingPool];

  const pollCalculateData = () => {
    stopPollingEpochData();

    if (lengthOfBlackoutWindow && nextEpochDate) {
      const secondsRemainingInCurrentEpoch = DateTime.fromISO(nextEpochDate).diffNow('seconds')
        .seconds;

      if (secondsRemainingInCurrentEpoch < 0) {
        getParamsAndCalculateData();
        return;
      }

      const newCurrentlyInBlackoutWindow =
        secondsRemainingInCurrentEpoch < Number(lengthOfBlackoutWindow);

      dispatch(
        updateStakingPoolsData({
          stakingPool,
          data: {
            currentlyInBlackoutWindow: newCurrentlyInBlackoutWindow,
          },
        })
      );

      pollingFunction = setTimeout(pollCalculateData, epochDataPollingInterval);
    }
  };

  const getParamsAndCalculateData = async () => {
    stopPollingEpochData();

    const {
      timeRemainingInCurrentEpoch,
      lengthOfBlackoutWindow: newLengthOfBlackoutWindow,
    } = await contractClient.stakingPoolClient.getEpochParams({ stakingPool });

    const nextEpochISOString = DateTime.local()
      .plus({ seconds: Number(timeRemainingInCurrentEpoch) })
      .toISO();

    const newCurrentlyInBlackoutWindow =
      Number(timeRemainingInCurrentEpoch) < Number(newLengthOfBlackoutWindow);

    dispatch(
      updateStakingPoolsData({
        stakingPool,
        data: {
          currentlyInBlackoutWindow: newCurrentlyInBlackoutWindow,
          lengthOfBlackoutWindow: newLengthOfBlackoutWindow,
          nextEpochDate: nextEpochISOString,
        },
      })
    );

    pollingFunction = setTimeout(pollCalculateData, epochDataPollingInterval);
  };

  useEffect(() => {
    if (!pollingFunction) {
      setIsInstancePolling(true);
    }
  }, []);

  useEffect(
    () => () => {
      if (isInstancePolling) {
        stopPollingEpochData();
      }
    },
    [isInstancePolling]
  );

  useEffect(() => {
    if (isInstancePolling) {
      stopPollingEpochData();

      if (lengthOfBlackoutWindow && nextEpochDate) {
        pollingFunction = setTimeout(pollCalculateData, epochDataPollingInterval);
      } else {
        getParamsAndCalculateData();
      }
    }
  }, [currentlyInBlackoutWindow, lengthOfBlackoutWindow, nextEpochDate, isInstancePolling]);
};

export default usePollEpochData;
