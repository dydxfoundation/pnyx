import { createAction } from 'redux-actions';

import { SetCirculatingSupplyPayload } from 'types';

export const setCirculatingSupply = createAction<SetCirculatingSupplyPayload | void>(
  'SET_CIRCULATING_SUPPLY'
);
