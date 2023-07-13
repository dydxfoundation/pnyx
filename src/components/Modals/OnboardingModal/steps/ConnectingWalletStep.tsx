import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';
import { WalletType } from '@/enums';

import { withLocalization } from '@/hoc';
import { UndoIcon } from '@/icons';

import { disconnectWallet as disconnectWalletAction } from '@/actions/wallets';

import LoadingSpinner, { SpinnerSize } from '@/components/LoadingSpinner';
import { ModalHeader, ModalContentContainer } from '@/components/Modals';

import { getWalletType, getIsWalletConnecting, getWalletAddress } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';
import { LOCAL_STORAGE_KEYS, setLocalStorage } from '@/lib/local-storage';

import { OnboardingStepFooterLinks } from './OnboardingStepStyles';

export type ConnectingWalletStepProps = {
  closeModal: () => void;
  goToPreviousStep: () => void;
} & LocalizationProps;

const ConnectingWalletStep: React.FC<
  ConnectingWalletStepProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({
  closeModal,
  disconnectWallet,
  goToPreviousStep,
  isWalletConnecting,
  stringGetter,
  walletAddress,
  walletType,
}) => {
  useEffect(() => {
    if (!walletType) {
      goToPreviousStep();
    } else if (!isWalletConnecting) {
      if (walletAddress) {
        setLocalStorage({ key: LOCAL_STORAGE_KEYS.LAST_WALLET_USED, value: walletType });
        closeModal();
      } else {
        goToPreviousStep();
      }
    }
  }, [isWalletConnecting, walletAddress, walletType, goToPreviousStep, closeModal]);

  return (
    <div>
      <ModalHeader noBorder title={stringGetter({ key: STRING_KEYS.CONNECTING })} />
      <ModalContentContainer>
        <StyledSpinner>
          <LoadingSpinner size={SpinnerSize.Large} />
        </StyledSpinner>
        <OnboardingStepFooterLinks>
          <TryAgainLink
            role="button"
            tabIndex={0}
            onClick={() => {
              disconnectWallet({ walletType: walletType as WalletType });
              goToPreviousStep();
            }}
          >
            <UndoIcon />
            {stringGetter({ key: STRING_KEYS.TRY_AGAIN })}
          </TryAgainLink>
        </OnboardingStepFooterLinks>
      </ModalContentContainer>
    </div>
  );
};

const StyledSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 11.25rem;
  width: 100%;
  padding-bottom: 1rem;
`;

const TryAgainLink = styled.div`
  color: ${({ theme }) => theme.textbase};

  > svg {
    margin-right: 0.25rem;
  }

  &:hover {
    color: ${({ theme }) => theme.textlight};

    > svg path {
      fill: ${({ theme }) => theme.textlight};
    }
  }
`;

const mapStateToProps = (state: RootState) => ({
  isWalletConnecting: getIsWalletConnecting(state),
  walletAddress: getWalletAddress(state),
  walletType: getWalletType(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      disconnectWallet: disconnectWalletAction,
    },
    dispatch
  );

export default withLocalization<ConnectingWalletStepProps>(
  connect(mapStateToProps, mapDispatchToProps)(ConnectingWalletStep)
);
