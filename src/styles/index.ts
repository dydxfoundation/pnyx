import styled from 'styled-components';

import breakpoints from './breakpoints';
import colors from './colors';
import { fonts, fontSizes } from './fonts';

export const MobileOnly = styled.div`
  @media ${breakpoints.notMobile} {
    display: none;
  }
`;

export const NotMobileOnly = styled.div`
  @media ${breakpoints.mobile} {
    display: none;
  }
`;

export const TabletOnly = styled.div`
  @media ${breakpoints.notTablet} {
    display: none;
  }
`;

export const NotTabletOnly = styled.div`
  @media ${breakpoints.tablet} {
    display: none;
  }
`;

export { breakpoints, colors, fonts, fontSizes };
