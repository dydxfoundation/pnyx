import { BreakpointRem } from 'enums';

export default {
  mobile: `(max-width: ${BreakpointRem.Mobile}rem)`,
  tablet: `(max-width: ${BreakpointRem.Tablet}rem)`,
  notTablet: `(min-width: calc(${BreakpointRem.Tablet}rem + 0.01rem))`,
  desktopSmall: `(max-width: ${BreakpointRem.DesktopSmall}rem)`,
};
