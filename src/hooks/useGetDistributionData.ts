import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setCirculatingSupply, setDistributedToday } from '@/actions/distribution';
import { getCirculatingSupply, getDistributedToday } from '@/selectors/distribution';

import contractClient from '@/lib/contract-client';

type DistributionData = {
  circulatingSupply: string | undefined;
  distributedToday: string | undefined;
};

const useGetDistributionData = (): DistributionData => {
  const dispatch = useDispatch();

  const circulatingSupply = useSelector(getCirculatingSupply);
  const distributedToday = useSelector(getDistributedToday);

  const [currentDistributionData, setCurrentDistributionData] = useState<DistributionData>({
    circulatingSupply: undefined,
    distributedToday: undefined,
  });

  const requestDistributionData = async () => {
    const circulatingSupplyResponse = await contractClient.getCirculatingSupply();
    dispatch(setCirculatingSupply({ circulatingSupply: circulatingSupplyResponse }));

    const distributedTodayResponse = '719179'; // Distributed each epoch
    dispatch(setDistributedToday({ distributedToday: distributedTodayResponse }));

    setCurrentDistributionData({
      circulatingSupply: circulatingSupplyResponse,
      distributedToday: distributedTodayResponse,
    });
  };

  useEffect(() => {
    if (!circulatingSupply || !distributedToday) {
      requestDistributionData();
    } else {
      setCurrentDistributionData({ circulatingSupply, distributedToday });
    }
  }, []);

  return currentDistributionData;
};

export default useGetDistributionData;
