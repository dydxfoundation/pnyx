import { createAction } from 'redux-actions';

import { PageSizeChangedPayload } from '@/types';

export const pageLoaded = createAction<void>('PAGE_LOADED');
export const pageSizeChanged = createAction<PageSizeChangedPayload | void>('PAGE_SIZE_CHANGED');
