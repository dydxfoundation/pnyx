import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { setCirculatingSupply } from 'actions/distribution';

import contractClient from 'lib/contract-client';
import { getCirculatingSupply } from 'selectors/distribution';

const useGetCirculatingSupply = (): string | undefined => {
  const dispatch = useDispatch();
  const circulatingSupply = useSelector(getCirculatingSupply, shallowEqual);

  const [currentCirculatingSupply, setCurrentCirculatingSupply] = useState<string | undefined>();

  const requestCirculatingSupply = async () => {
    const circulatingSupplyResponse = await contractClient.getCirculatingSupply();
    dispatch(setCirculatingSupply({ circulatingSupply: circulatingSupplyResponse }));
    setCurrentCirculatingSupply(circulatingSupplyResponse);
  };

  useEffect(() => {
    if (_.isNil(circulatingSupply)) {
      requestCirculatingSupply();
    } else {
      setCurrentCirculatingSupply(circulatingSupply);
    }
  }, []);

  return currentCirculatingSupply;
};

export default useGetCirculatingSupply;
