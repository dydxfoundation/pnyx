import { RootState } from '@/store';
import { AllowancesState } from '@/types';

export const getAllowances = (state: RootState): AllowancesState => state.allowances.allowances;
