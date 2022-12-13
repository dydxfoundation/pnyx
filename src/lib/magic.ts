import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

import { SupportedLocale } from 'enums';

import { getLocalStorage, LOCAL_STORAGE_KEYS } from './local-storage';

const magicAuth = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY as string, {
  extensions: [new OAuthExtension()],
  locale: getLocalStorage({ key: LOCAL_STORAGE_KEYS.SELECTED_LOCALE }) || SupportedLocale.EN,
  testMode: false,
  network: {
    rpcUrl: process.env.REACT_APP_ETHEREUM_NODE_URI as string,
  },
});

export default magicAuth;
