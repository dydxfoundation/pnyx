import { SupportedLocale } from 'enums';

import { APP_STRING_KEYS } from './app';
import { ERROR_STRING_KEYS } from './errors';
import { WARNING_STRING_KEYS } from './warnings';

export const SUPPORTED_LOCALE_BASE_TAGS = {
  [SupportedLocale.EN]: 'en',
  [SupportedLocale.ZH_CN]: 'zh',
  [SupportedLocale.JA]: 'ja',
  [SupportedLocale.KO]: 'ko',
  [SupportedLocale.RU]: 'ru',
};

export const SUPPORTED_BASE_TAGS_LOCALE_MAPPING: { [key: string]: SupportedLocale } = {
  en: SupportedLocale.EN,
  zh: SupportedLocale.ZH_CN,
  ja: SupportedLocale.JA,
  ko: SupportedLocale.KO,
  ru: SupportedLocale.RU,
};

export const SUPPORTED_LOCALE_STRING_LABELS = {
  [SupportedLocale.EN]: 'English',
  [SupportedLocale.ZH_CN]: '中文',
  [SupportedLocale.JA]: '日本語',
  [SupportedLocale.KO]: '한국어',
  [SupportedLocale.RU]: 'русский',
};

export const STRING_KEYS = {
  ...APP_STRING_KEYS,
  ...ERROR_STRING_KEYS,
  ...WARNING_STRING_KEYS,
};
