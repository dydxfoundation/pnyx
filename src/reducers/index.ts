import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';

import allowances from './allowances';
import balances from './balances';
import distribution from './distribution';
import geo from './geo';
import governance from './governance';
import localization from './localization';
import modals from './modals';
import network from './network';
import notifications from './notifications';
import page from './page';
import stakingPools from './staking-pools';
import tradingRewards from './trading-rewards';
import wallets from './wallets';

export default (history: History) =>
  combineReducers({
    allowances,
    balances,
    distribution,
    geo,
    governance,
    localization,
    modals,
    network,
    notifications,
    page,
    router: connectRouter(history),
    stakingPools,
    tradingRewards,
    wallets,
  });
