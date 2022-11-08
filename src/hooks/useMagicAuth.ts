import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Magic } from 'magic-sdk';
import { SupportedLocale } from '@magic-sdk/types';

import { getSelectedLocale } from 'selectors/localization';

import magicAuth from 'lib/magic';

const useMagicAuth = (): Magic => {
  const selectedLocale = useSelector(getSelectedLocale);

  const [localizedMagic, setLocalizedMagic] = useState(magicAuth);

  useEffect(() => {
    if (magicAuth.locale !== selectedLocale) {
      setLocalizedMagic(
        new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY as string, {
          locale: selectedLocale as SupportedLocale,
          network: {
            rpcUrl: process.env.REACT_APP_ETHEREUM_NODE_URI as string,
          },
        })
      );
    }
  }, [selectedLocale]);

  return localizedMagic;
};

export default useMagicAuth;
