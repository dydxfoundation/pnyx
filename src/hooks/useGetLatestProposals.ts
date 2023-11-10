import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

// @ts-ignore-next-line
import type { Proposals } from '@dydxfoundation-v3/governance';

import { setLatestProposals } from '@/actions/governance';

import contractClient from '@/lib/contract-client';
import { getLatestProposals } from '@/selectors/governance';

const useGetLatestProposals = (): Proposals[] => {
  const dispatch = useDispatch();
  const latestProposals = useSelector(getLatestProposals, shallowEqual);

  const [currentLatestProposals, setCurrentLatestProposals] = useState<Proposals[]>([]);

  const requestLatestProposals = async () => {
    const proposals = await contractClient.governanceClient.getLatestProposals();

    dispatch(setLatestProposals({ proposals }));
    setCurrentLatestProposals(proposals);
  };

  useEffect(() => {
    if (_.isNil(latestProposals)) {
      requestLatestProposals();
    } else {
      setCurrentLatestProposals(latestProposals);
    }
  }, []);

  return currentLatestProposals;
};

export default useGetLatestProposals;
