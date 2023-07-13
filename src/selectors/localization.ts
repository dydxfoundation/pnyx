import { createSelector } from 'reselect';
import _ from 'lodash';

import { RootState } from '@/store';
import { SupportedLocale } from '@/enums';
import { LocaleData, StringGetterFunction } from '@/types';

import enLocaleData from '@/localization/en';

export const getIsLocaleLoaded = (state: RootState): boolean =>
  _.get(state, 'localization.isLocaleLoaded');

export const getSelectedLocale = (state: RootState): SupportedLocale =>
  _.get(state, 'localization.selectedLocale');

export const getSelectedLocaleData = (state: RootState): LocaleData =>
  _.get(state, 'localization.localeData');

export const getStringGetterForLocaleData = (localeData: LocaleData): StringGetterFunction => ({
  key,
  params = {},
}) => {
  // Fallback to english whenever a key doesn't exist for other languages
  let formattedString: string = ((_.get(localeData, key) ||
    _.get(enLocaleData, key, '')) as unknown) as string;

  _.forEach(params, (value, paramKey) => {
    formattedString = formattedString.replace(new RegExp(`{${paramKey}}`, 'g'), value);
  });

  return formattedString;
};

export const getLocaleStringGetter = createSelector(
  [getSelectedLocaleData],
  getStringGetterForLocaleData
);
