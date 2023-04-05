/* eslint-disable  @typescript-eslint/no-explicit-any */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { RootState } from '@/store';
import { NoOpFunction, StringGetterFunction } from '@/types';

import LoadingSpace from '@/components/LoadingSpace';

import { getIsLocaleLoaded, getLocaleStringGetter } from '@/selectors/localization';

const LocalizationContext: React.Context<StringGetterFunction | NoOpFunction> = React.createContext(
  _.noop
);

type UnconnectedLocalizationWrapperProps = {
  children: React.ReactNode;
  isLocaleLoaded: boolean;
  stringGetter: StringGetterFunction;
};

const UnconnectedLocalizationWrapper: React.FC<UnconnectedLocalizationWrapperProps> = ({
  children,
  isLocaleLoaded,
  stringGetter,
}) => (
  <LocalizationContext.Provider value={stringGetter}>
    {!isLocaleLoaded ? <LoadingSpace /> : children}
  </LocalizationContext.Provider>
);

const mapStateToProps = (state: RootState) => ({
  isLocaleLoaded: getIsLocaleLoaded(state),
  stringGetter: getLocaleStringGetter(state),
});

export const LocalizationWrapper = connect(mapStateToProps)(UnconnectedLocalizationWrapper);

type WithLocalizationProps = {
  stringGetter: StringGetterFunction;
};

export const withLocalization = <ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps>
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    Omit<
      ComponentProps & WithLocalizationProps & React.HTMLAttributes<HTMLElement>,
      keyof WithLocalizationProps
    >
  > &
    React.RefAttributes<HTMLElement>
> =>
  React.forwardRef<
    HTMLElement,
    Omit<
      ComponentProps & WithLocalizationProps & React.HTMLAttributes<HTMLElement>,
      keyof WithLocalizationProps
    >
  >((props, ref) => (
    <LocalizationContext.Consumer>
      {(context) => <Component {...(props as ComponentProps)} ref={ref} stringGetter={context} />}
    </LocalizationContext.Consumer>
  ));
