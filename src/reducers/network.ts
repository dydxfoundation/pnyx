import { SetCurrentBlockNumberPayload } from '@/types';

import { setCurrentBlockNumber } from '@/actions/network';

type State = {
  currentBlockNumber: number | null;
};

type Action = {
  type: string;
  payload: SetCurrentBlockNumberPayload;
};

const initialState: State = {
  currentBlockNumber: null,
};

export default function networkReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setCurrentBlockNumber().type: {
      return {
        ...state,
        currentBlockNumber: payload?.currentBlockNumber,
      };
    }
    default: {
      return state;
    }
  }
}
