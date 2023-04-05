import { BreakpointRem } from '@/enums';

export default {
  mobile: `(max-width: ${BreakpointRem.Mobile}rem)`,
  notMobile: `(min-width: calc(${BreakpointRem.Mobile}rem + 0.01rem))`,
  tablet: `(max-width: ${BreakpointRem.Tablet}rem)`,
  notTablet: `(min-width: calc(${BreakpointRem.Tablet}rem + 0.01rem))`,
  desktopSmall: `(max-width: ${BreakpointRem.DesktopSmall}rem)`,
};
