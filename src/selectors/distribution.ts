import { RootState } from 'store';

export const getCirculatingSupply = (state: RootState): string | null =>
  state.distribution.circulatingSupply;
