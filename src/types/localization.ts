import { SupportedLocale } from '@/enums';

export type LocaleData = {
  [key: string]: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        };
  };
};

export type LocalizationProps = {
  stringGetter: StringGetterFunction;
};

export type SetSelectedLocalePayload = {
  locale: SupportedLocale;
  isAutoDetect?: boolean;
};

export type StringGetterFunction = (a: {
  key: string;
  params?: {
    [key: string]: string;
  };
}) => string;
