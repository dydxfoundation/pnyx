import { createAction } from 'redux-actions';

import type { SetCurrentBlockNumberPayload } from '@/types';

export const setCurrentBlockNumber = createAction<SetCurrentBlockNumberPayload | void>(
  'SET_CURRENT_BLOCK_NUMBER'
);
