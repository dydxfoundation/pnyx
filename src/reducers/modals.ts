import _ from 'lodash';

import { ModalConfig, OpenModalPayload, CloseModalPayload } from '@/types';

import { openModal, closeModal } from '@/actions/modals';
import { userAccountChanged, disconnectWallet } from '@/actions/wallets';

type State = {
  modalConfig: ModalConfig;
};

type Action = {
  type: string;
  payload?: OpenModalPayload & CloseModalPayload;
};

const initialState: State = {
  modalConfig: null,
};

const modalsReducer = (state: State = initialState, { type, payload }: Action) => {
  switch (type) {
    case openModal().type: {
      const { type: modalType, props: modalProps = {} } = payload || {};

      return {
        ...state,
        modalConfig: {
          type: modalType,
          props: modalProps,
        },
      };
    }
    case closeModal().type: {
      const { type: modalType } = payload || {};

      if (_.get(state, 'modalConfig.type') === modalType) {
        return {
          ...state,
          modalConfig: null,
        };
      }

      return state;
    }
    case userAccountChanged().type:
    case disconnectWallet().type: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
};

export default modalsReducer;
