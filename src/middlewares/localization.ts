import { Middleware } from 'redux';

import { RootState } from '@/store';
import { SupportedLocale } from '@/enums';

import { pageLoaded } from '@/actions/page';
import { setLocaleLoaded, setSelectedLocale, setLocaleData } from '@/actions/localization';

import { getSelectedLocale } from '@/selectors/localization';
import { SUPPORTED_BASE_TAGS_LOCALE_MAPPING } from '@/constants/localization';

import { LOCAL_STORAGE_KEYS, getLocalStorage, setLocalStorage } from '@/lib/local-storage';

const getNewLocaleData = async ({
  store,
  localeKey,
  isAutoDetect,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any;
  localeKey: SupportedLocale;
  isAutoDetect?: boolean;
}) => {
  store.dispatch(setLocaleLoaded(false));

  const newLocaleData = await import(`@/localization/${localeKey}/index.ts`);
  store.dispatch(setLocaleData(newLocaleData.default));

  if (!isAutoDetect) {
    setLocalStorage({ key: LOCAL_STORAGE_KEYS.SELECTED_LOCALE, value: localeKey });
  }
};

const localizationMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
  if (action.type === pageLoaded().type) {
    const state = store.getState();
    const selectedLocale = getSelectedLocale(state);
    const localStorageLocale = getLocalStorage({ key: LOCAL_STORAGE_KEYS.SELECTED_LOCALE });

    if (localStorageLocale && localStorageLocale !== SupportedLocale.EN) {
      getNewLocaleData({ store, localeKey: selectedLocale as SupportedLocale });
    } else if (window.navigator) {
      const browserLanguage = window.navigator.language;

      if (browserLanguage) {
        const [baseTag] = browserLanguage.split('-');
        const mappedLocale = SUPPORTED_BASE_TAGS_LOCALE_MAPPING[baseTag.toLowerCase()];

        if (mappedLocale && mappedLocale !== SupportedLocale.EN) {
          store.dispatch(setSelectedLocale({ locale: mappedLocale, isAutoDetect: true }));
        }
      }
    }
  }

  if (action.type === setSelectedLocale().type) {
    const { locale, isAutoDetect } = action.payload;

    const state = store.getState();
    const selectedLocale = getSelectedLocale(state);

    if (selectedLocale !== action.payload?.locale) {
      getNewLocaleData({ store, localeKey: locale, isAutoDetect });
    }
  }

  next(action);
};

export default localizationMiddleware;
