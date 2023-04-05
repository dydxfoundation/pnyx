import { SupportedLocale } from '@/enums';
import { LocaleData, SetSelectedLocalePayload } from '@/types';
import { setLocaleLoaded, setSelectedLocale, setLocaleData } from '@/actions/localization';

import { LOCAL_STORAGE_KEYS, getLocalStorage } from '@/lib/local-storage';

import enLocaleData from '@/localization/en';

const localStorageLocale = getLocalStorage({ key: LOCAL_STORAGE_KEYS.SELECTED_LOCALE });

type State = {
  isLocaleLoaded: boolean;
  selectedLocale: SupportedLocale;
  localeData: LocaleData;
};

type Action = {
  type: string;
  payload?: SetSelectedLocalePayload & LocaleData;
};

const initialState: State = {
  isLocaleLoaded: !localStorageLocale || localStorageLocale === SupportedLocale.EN,
  selectedLocale: localStorageLocale || SupportedLocale.EN,
  localeData: enLocaleData,
};

const localizationReducer = (state: State = initialState, { type, payload }: Action) => {
  switch (type) {
    case setLocaleLoaded().type: {
      return {
        ...state,
        isLocaleLoaded: payload,
      };
    }
    case setLocaleData().type: {
      return {
        ...state,
        localeData: payload,
        isLocaleLoaded: true,
      };
    }
    case setSelectedLocale().type: {
      return {
        ...state,
        selectedLocale: payload?.locale,
      };
    }
    default: {
      return state;
    }
  }
};

export default localizationReducer;
