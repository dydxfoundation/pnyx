import { GeoData, SetGeoDataPayload } from '@/types';

import { setGeoData } from '@/actions/geo';

type State = {
  geoData: GeoData | null;
};

type Action = {
  type: string;
  payload?: SetGeoDataPayload;
};

const initialState: State = {
  geoData: null,
};

export default function geoReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setGeoData().type: {
      return {
        geoData: payload?.geoData || null,
      };
    }
    default:
      return state;
  }
}
