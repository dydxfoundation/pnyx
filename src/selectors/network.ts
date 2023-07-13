import { RootState } from '@/store';

export const getCurrentBlockNumber = (state: RootState): number | null =>
  state.network.currentBlockNumber;
