import { RootState } from '@/store';
import { StakingPoolsDataState } from '@/types';

export const getStakingPoolsData = (state: RootState): StakingPoolsDataState => state.stakingPools;
