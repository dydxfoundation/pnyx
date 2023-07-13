import _ from 'lodash';

import { RootState } from '@/store';
import { GeoData } from '@/types';

import { BLOCKED_COUNTRIES } from '@/constants/geo';

export const getGeoData = (state: RootState): GeoData | null => state.geo.geoData;

export const getIsUserGeoBlocked = (state: RootState): boolean =>
  _.includes(BLOCKED_COUNTRIES, state.geo.geoData?.country);
