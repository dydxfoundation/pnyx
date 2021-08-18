import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import store, { history } from '../src/store';
import { LocalizationWrapper } from '../src/hoc';
import { globalTheme, GlobalStyles } from '../src/App';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={globalTheme}>
          <GlobalStyles />
          <LocalizationWrapper>
            <Story />
          </LocalizationWrapper>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  ),
];
