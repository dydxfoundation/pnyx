import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import _ from 'lodash';

import { AppDispatch } from '@/store';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { breakpoints } from '@/styles';

import Button, { ButtonColor, ButtonSize } from '@/components/Button';
import { ModalHeader, ModalContentContainer } from '@/components/Modals';
import WalletIcon from '@/components/WalletIcon';

import { connectWallet as connectWalletAction } from '@/actions/wallets';

import { STRING_KEYS } from '@/constants/localization';
import { DISPLAYED_WALLETS } from '@/constants/wallets';

import { OnboardingStepFooterLinks } from './OnboardingStepStyles';

export type ChooseWalletStepProps = {
  closeModal: () => void;
  goToNextStep: () => void;
} & LocalizationProps;

const ChooseWalletStep: React.FC<ChooseWalletStepProps & ReturnType<typeof mapDispatchToProps>> = ({
  closeModal,
  connectWallet,
  goToNextStep,
  stringGetter,
}) => (
  <>
    <ModalHeader noBorder title={stringGetter({ key: STRING_KEYS.CONNECT_YOUR_WALLET })} />
    <ModalContentContainer>
      <WalletOptionsContainer>
        {_.map(DISPLAYED_WALLETS, (walletType) => (
          <Button
            key={walletType}
            color={ButtonColor.Light}
            size={ButtonSize.Small}
            onClick={() => {
              connectWallet({ walletType });
              goToNextStep();
            }}
          >
            <WalletIcon walletType={walletType} />
            {stringGetter({ key: STRING_KEYS[walletType] })}
          </Button>
        ))}
      </WalletOptionsContainer>
      <OnboardingStepFooterLinks>
        <div role="button" tabIndex={0} onClick={closeModal} onKeyDown={closeModal}>
          {stringGetter({ key: STRING_KEYS.SKIP_FOR_NOW })} →
        </div>
      </OnboardingStepFooterLinks>
    </ModalContentContainer>
  </>
);

const WalletOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem 1rem 0;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.875rem;

  @media ${breakpoints.mobile} {
    flex-direction: column;
    flex-wrap: nowrap;
    max-height: 54vh;
    overflow: scroll;
  }

  > button {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    margin-bottom: 0.75rem;

    &:not(:last-child) {
      margin-right: 0.75rem;

      @media ${breakpoints.mobile} {
        margin-right: 0;
      }
    }

    > svg,
    > img {
      width: 1.125rem;
      height: 1.125rem;
      margin-right: 0.5rem;
      border-radius: 0.25rem;
    }

    @media ${breakpoints.mobile} {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      width: 100%;
      height: 3rem;

      &:last-child {
        margin-bottom: 0;
      }

      > svg {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0;
      }
    }
  }
`;

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      connectWallet: connectWalletAction,
    },
    dispatch
  );

export default withLocalization<ChooseWalletStepProps>(
  connect(null, mapDispatchToProps)(ChooseWalletStep)
);
