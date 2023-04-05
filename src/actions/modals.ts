import { createAction } from 'redux-actions';
import { OpenModalPayload, CloseModalPayload } from '@/types';

export const openModal = createAction<OpenModalPayload | void>('OPEN_MODAL');
export const closeModal = createAction<CloseModalPayload | void>('CLOSE_MODAL');
