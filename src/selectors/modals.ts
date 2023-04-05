import _ from 'lodash';

import { RootState } from '@/store';
import { ModalConfig } from '@/types';

export const getModalConfig = (state: RootState): ModalConfig => _.get(state, 'modals.modalConfig');
