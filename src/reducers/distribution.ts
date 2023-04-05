import { SetCirculatingSupplyPayload, SetDistributedTodayPayload } from '@/types';

import { setCirculatingSupply, setDistributedToday } from '@/actions/distribution';

type State = {
  circulatingSupply: string | null;
  distributedToday: string | null;
};

type Action = {
  type: string;
  payload: SetCirculatingSupplyPayload & SetDistributedTodayPayload;
};

const initialState: State = {
  circulatingSupply: null,
  distributedToday: null,
};

export default function distributionReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case setCirculatingSupply().type: {
      return {
        ...state,
        circulatingSupply: payload?.circulatingSupply,
      };
    }
    case setDistributedToday().type: {
      return {
        ...state,
        distributedToday: payload?.distributedToday,
      };
    }
    default: {
      return state;
    }
  }
}
