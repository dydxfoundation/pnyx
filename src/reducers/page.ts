import { Breakpoint } from '@/enums';
import { PageViewport, PageSizeChangedPayload } from '@/types';

import { pageSizeChanged } from '@/actions/page';

type State = {
  pageViewport: PageViewport;
};

type Action = {
  type: string;
  payload: PageSizeChangedPayload;
};

const initialState: State = {
  pageViewport: {
    height: window.visualViewport ? window.visualViewport.height : window.innerHeight,
    width: window.visualViewport ? window.visualViewport.width : window.innerWidth,
    isMobile: window.visualViewport ? window.visualViewport.width <= Breakpoint.Mobile : false,
    isTablet: window.visualViewport ? window.visualViewport.width <= Breakpoint.Tablet : false,
  },
};

export default function pageViewportReducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case pageSizeChanged().type: {
      return {
        ...state,
        pageViewport: {
          ...payload,
          isMobile: payload.width <= Breakpoint.Mobile,
          isTablet: payload.width <= Breakpoint.Tablet,
        },
      };
    }
    default: {
      return state;
    }
  }
}
