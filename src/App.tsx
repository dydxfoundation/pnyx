import React, { lazy, Suspense } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { breakpoints, colors, fonts } from '@/styles';
import { GeoFence, InitializePage, LocalizationWrapper } from '@/hoc';
import { AppRoute, StakingPoolRoute } from '@/enums';
import { Theme } from '@/types';

import Banner from './components/Banner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import LoadingSpace from '@/components/LoadingSpace';
import { ModalManager } from '@/components/Modals';

import store, { history } from './store';

import '@/styles/normalize.css';
import '@/styles/font-faces.css';

export const globalTheme: Theme = {
  ...colors,
};

const DashboardPage = lazy(() => import('./pages/dashboard/Dashboard'));
const HistoryPage = lazy(() => import('./pages/history/History'));
const MigratePage = lazy(() => import('./pages/migrate/Migrate'));

const SafetyPoolDetailPage = lazy(() => import('./pages/dashboard/staking-pools/SafetyPoolDetail'));

const LiquidityPoolDetailPage = lazy(
  () => import('./pages/dashboard/staking-pools/LiquidityPoolDetail')
);

const ProposalDetailPage = lazy(() => import('./pages/dashboard/proposals/ProposalDetail'));

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  html,
  body {
    height: 100%;
  }

  body {
    ${fonts.medium}
    background-color: ${({ theme }) => theme.layerbase};
    color: ${({ theme }) => theme.textbase};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  #root {
    height: 100%;
    overflow: hidden;
  }

  div {
    box-sizing: border-box;
  }

  .no-scroll {
    overflow: hidden;
  }

  // Library styles
  .ReactCollapse--collapse {
    transition: height 0.25s ease;
  }

  .Toastify {
    position: fixed;
    max-width: 76rem;
    width: 100%;
    margin: 0 auto;
    left: 0;
    right: 0;
    z-index: 989;
  }

  .Toastify__toast-container {
    position: absolute;
    padding-top: 1rem;

    &--top-right {
      top: 5rem;
      right: 1rem;

      @media ${breakpoints.tablet} {
        top: 5rem;
        left: 1.5rem;
      }
    }
  }

  .custom-toast-container {
    width: 17rem;
    padding: 0;

    @media ${breakpoints.tablet} {
      width: calc(100% - 3rem);
    }
  }

  .custom-toast {
    ${fonts.medium}
    padding: 0;
    border-radius: 0.375rem;
    background: ${({ theme }) => theme.layerlight};
    background-color: ${({ theme }) => theme.layerlight};
    overflow: initial;
    margin-bottom: 1rem;
  }

  .custom-toast-body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  
  div {
    scrollbar-width: none;

     &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }
  }
`;

const App: React.FC = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={globalTheme}>
        <GlobalStyles />
        <InitializePage />
        <LocalizationWrapper>
          <ModalManager />
          <ToastContainer
            hideProgressBar
            autoClose={false}
            closeButton={false}
            closeOnClick={false}
            className="custom-toast-container"
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
          />

          <PageWrapper>
            <Banner />
            <Header />
            <GeoFence>
              <Suspense fallback={<LoadingSpace id="main-page-content" />}>
                <Switch>
                  <Route path={StakingPoolRoute.SafetyPool} component={SafetyPoolDetailPage} />
                  <Route
                    path={StakingPoolRoute.LiquidityPool}
                    component={LiquidityPoolDetailPage}
                  />
                  <Route
                    path={`${AppRoute.ProposalDetail}/:proposalId`}
                    component={ProposalDetailPage}
                  />
                  <Route path={AppRoute.History} component={HistoryPage} />
                  <Route path={AppRoute.Dashboard} component={DashboardPage} />
                  <Route path={AppRoute.Migrate} component={MigratePage} />
                  <Redirect to={AppRoute.Dashboard} />
                </Switch>
              </Suspense>
            </GeoFence>
            <Footer />
          </PageWrapper>
        </LocalizationWrapper>
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default App;
