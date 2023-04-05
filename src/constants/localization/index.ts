import { SupportedLocale } from '@/enums';

import { APP_STRING_KEYS } from './app';
import { ERROR_STRING_KEYS } from './errors';
import { WARNING_STRING_KEYS } from './warnings';

export const SUPPORTED_LOCALE_BASE_TAGS: Record<SupportedLocale, string> = {
  [SupportedLocale.EN]: 'en',
  [SupportedLocale.ZH_CN]: 'zh',
  [SupportedLocale.JA]: 'ja',
  [SupportedLocale.KO]: 'ko',
  [SupportedLocale.RU]: 'ru',
  [SupportedLocale.TR]: 'tr',
  [SupportedLocale.FR]: 'fr',
  [SupportedLocale.PT]: 'pt',
  [SupportedLocale.ES]: 'es',
};

export const SUPPORTED_BASE_TAGS_LOCALE_MAPPING = Object.fromEntries(
  Object.entries(SUPPORTED_LOCALE_BASE_TAGS).map(([locale, baseTag]) => [baseTag, locale as SupportedLocale])
);

export const SUPPORTED_LOCALE_STRING_LABELS = {
  [SupportedLocale.EN]: 'English',
  [SupportedLocale.ZH_CN]: '中文',
  [SupportedLocale.JA]: '日本語',
  [SupportedLocale.KO]: '한국어',
  [SupportedLocale.RU]: 'русский',
  [SupportedLocale.TR]: 'Türkçe',
  [SupportedLocale.FR]: 'Français',
  [SupportedLocale.PT]: 'Português',
  [SupportedLocale.ES]: 'Español',
};

export const STRING_KEYS = {
  ...APP_STRING_KEYS,
  ...ERROR_STRING_KEYS,
  ...WARNING_STRING_KEYS,
};
