import { SetCirculatingSupplyPayload } from 'types';

import { setCirculatingSupply } from 'actions/distribution';

type State = {
  circulatingSupply: string | null;
};

type Action = {
  type: string;
  payload: SetCirculatingSupplyPayload;
};

const initialState: State = {
  circulatingSupply: null,
};

export default function distributionReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setCirculatingSupply().type: {
      return {
        ...state,
        circulatingSupply: payload?.circulatingSupply,
      };
    }
    default: {
      return state;
    }
  }
}
