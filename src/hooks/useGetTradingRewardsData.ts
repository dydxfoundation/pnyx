import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { TradingRewardsData } from 'types';

import { setTradingRewardsData } from 'actions/trading-rewards';

import { getTradingRewardsData } from 'selectors/trading-rewards';
import { getWalletAddress } from 'selectors/wallets';

import contractClient from 'lib/contract-client';

const useGetTradingRewardsData = (): TradingRewardsData | undefined => {
  const dispatch = useDispatch();

  const tradingRewardsData = useSelector(getTradingRewardsData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const [currentTradingRewardsData, setCurrentTradingRewardsData] = useState<
    TradingRewardsData | undefined
  >();

  const requestTradingRewardsData = async () => {
    const fetchedTradingRewardsData = await contractClient.getTradingRewardsData({
      walletAddress: walletAddress as string,
    });

    dispatch(setTradingRewardsData({ tradingRewardsData: fetchedTradingRewardsData }));
    setCurrentTradingRewardsData(fetchedTradingRewardsData);
  };

  useEffect(() => {
    if (walletAddress) {
      if (!tradingRewardsData) {
        requestTradingRewardsData();
      } else {
        setCurrentTradingRewardsData(tradingRewardsData);
      }
    } else {
      setCurrentTradingRewardsData(undefined);
    }
  }, [tradingRewardsData, walletAddress]);

  return currentTradingRewardsData;
};

export default useGetTradingRewardsData;
