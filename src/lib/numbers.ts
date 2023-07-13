import BigNumber from 'bignumber.js';
import _ from 'lodash';

import { DecimalPlaces } from '@/enums';

export const MustBigNumber = (amount?: string | number | null | undefined): BigNumber =>
  new BigNumber(amount || 0);

export const getDecimalsForNumber = (num: string): number => {
  const numParts = _.split(num, '.');

  if (_.size(numParts) > 1) {
    return _.size(_.last(numParts));
  }

  return 0;
};

const SI_SYMBOLS = ['', 'K', 'M', 'B', 'T'];

export const abbreviateNumber = ({
  num,
  decimals = DecimalPlaces.Abbreviated,
}: {
  num: string | number;
  decimals?: DecimalPlaces;
}): {
  num: string;
  suffix: string;
} => {
  // eslint-disable-next-line no-bitwise
  const tier = (Math.log10(Math.abs(Number(num))) / 3) | 0;

  if (tier <= 0) {
    return {
      num: MustBigNumber(num).toFixed(decimals, BigNumber.ROUND_UP),
      suffix: '',
    };
  }

  const suffix = SI_SYMBOLS[tier] || '';
  const scale = 10 ** (tier * 3);

  return {
    num: MustBigNumber(num).div(scale).toFixed(decimals),
    suffix,
  };
};

export const BIG_NUMBERS = {
  ZERO: MustBigNumber(0),
};
