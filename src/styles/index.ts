import styled from 'styled-components/macro';

import breakpoints from './breakpoints';
import colors from './colors';
import { fonts, fontSizes } from './fonts';

export const NotMobileOnly = styled.div`
  display: none;

  @media ${breakpoints.notMobile} {
    display: initial;
  }
`;

export const NotTabletOnly = styled.div`
  display: none;

  @media ${breakpoints.notTablet} {
    display: initial;
  }
`;

export const TabletOnly = styled.div`
  display: none;

  @media ${breakpoints.tablet} {
    display: initial;
  }
`;

export { breakpoints, colors, fonts, fontSizes };
