import { createAction } from 'redux-actions';

import { SetGeoDataPayload } from '@/types';

export const setGeoData = createAction<SetGeoDataPayload | void>('SET_GEO_DATA');
