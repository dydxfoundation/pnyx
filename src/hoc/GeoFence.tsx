import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import LoadingSpace from '@/components/LoadingSpace';

import { setGeoData } from '@/actions/geo';
import { getGeoData } from '@/selectors/geo';

export type GeoFenceProps = {
  children: React.ReactNode;
};

const GeoFence: React.FC<GeoFenceProps> = ({ children }) => {
  const dispatch = useDispatch();
  const geoData = useSelector(getGeoData, shallowEqual);

  const fetchGeoData = async () => {
    const geoResponse = await fetch(import.meta.env.VITE_GEO_URI || '');
    const geoResponseData = await geoResponse.json();

    dispatch(setGeoData({ geoData: geoResponseData?.geo }));
  };

  useEffect(() => {
    fetchGeoData();
  }, []);

  if (!geoData) {
    return <LoadingSpace id="geo-fence" />;
  }

  return <>{children}</>;
};

export default GeoFence;
