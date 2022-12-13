import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { withLocalization } from 'hoc';
import { useMagicAuth } from 'hooks';
import { AppDispatch } from 'store';

import { openModal as openModalAction } from 'actions/modals';
import { connectWallet as connectWalletAction } from 'actions/wallets';

import LoadingSpace from 'components/LoadingSpace';

import { AppRoute, ModalType, WalletType } from 'enums';

const MagicOAuth: React.FC<RouteComponentProps & ReturnType<typeof mapDispatchToProps>> = ({
  history,
  connectWallet,
  openModal,
}) => {
  const magicAuth = useMagicAuth();

  const login = async () => {
    try {
      // @ts-ignore
      await magicAuth.oauth.getRedirectResult();
      if (await magicAuth.user.isLoggedIn()) {
        connectWallet({ walletType: WalletType.MagicAuth });
      }
    } catch (error) {
      openModal({ type: ModalType.Onboarding });
    } finally {
      history.replace(AppRoute.Dashboard);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <Container>
      <LoadingSpace />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
`;

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      connectWallet: connectWalletAction,
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization(withRouter(connect(null, mapDispatchToProps)(MagicOAuth)));
