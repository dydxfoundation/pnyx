import { createStore, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';

import { localization, notifications, walletConnection } from '@/middlewares';
import createRootReducer from '@/reducers';

export const history: History = createBrowserHistory();

const rootReducer = createRootReducer(history);
const initialState = {};

const middlewares: Middleware[] = [
  routerMiddleware(history),
  localization,
  walletConnection,
  notifications,
];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
