import { createAction } from 'redux-actions';
import { SetAllowancePayload, SetUserSentAllowanceTransactionPayload } from '@/types';

export const setAllowance = createAction<SetAllowancePayload | void>('SET_ALLOWANCE');

export const setUserSentAllowanceTransaction = createAction<SetUserSentAllowanceTransactionPayload | void>(
  'SET_USER_SENT_ALLOWANCE_TRANSACTION'
);
