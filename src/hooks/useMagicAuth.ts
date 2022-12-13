import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Magic } from 'magic-sdk';
import { SupportedLocale } from '@magic-sdk/types';
import { OAuthExtension } from '@magic-ext/oauth';

import { getSelectedLocale } from 'selectors/localization';

import magicAuth from 'lib/magic';

export const useMagicAuth = (): Magic => {
  const selectedLocale = useSelector(getSelectedLocale);

  const [localizedMagic, setLocalizedMagic] = useState(magicAuth);

  useEffect(() => {
    // @ts-ignore
    if (magicAuth.locale !== selectedLocale) {
      setLocalizedMagic(
        new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY as string, {
          extensions: [new OAuthExtension()],
          locale: selectedLocale as SupportedLocale,
          network: {
            rpcUrl: process.env.REACT_APP_ETHEREUM_NODE_URI as string,
          },
        })
      );
    }
  }, [selectedLocale]);

  return localizedMagic as unknown as Magic;
};

export default useMagicAuth;
