import { createAction } from 'redux-actions';

import { SetSelectedLocalePayload, LocaleData } from '@/types';

export const setLocaleLoaded = createAction<boolean | void>('SET_LOCALE_LOADED');

export const setSelectedLocale = createAction<SetSelectedLocalePayload | void>(
  'SET_SELECTED_LOCALE'
);

export const setLocaleData = createAction<LocaleData | void>('SET_LOCALE_DATA');
