import { createAction } from 'redux-actions';

import type { SetCirculatingSupplyPayload, SetDistributedTodayPayload } from '@/types';

export const setCirculatingSupply = createAction<SetCirculatingSupplyPayload | void>(
  'SET_CIRCULATING_SUPPLY'
);

export const setDistributedToday = createAction<SetDistributedTodayPayload | void>(
  'SET_DISTRIBUTED_TODAY'
);
