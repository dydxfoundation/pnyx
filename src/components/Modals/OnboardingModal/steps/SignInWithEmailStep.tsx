import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components/macro';

import { withLocalization } from 'hoc';
import { useMagicAuth } from 'hooks';
import { LocalizationProps } from 'types';
import { AppDispatch } from 'store';

import Button, { ButtonColor, ButtonSize } from 'components/Button';
import InputField, { InputFieldType } from 'components/InputField';
import { ModalHeader, ModalContentContainer } from 'components/Modals';

import { connectWallet as connectWalletAction } from 'actions/wallets';

import { WalletType } from 'enums';
import { STRING_KEYS } from 'constants/localization';

import { OnboardingStepFooterLinks } from './OnboardingStepStyles';

export type SignInWithEmailStepProps = {
  closeModal: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
} & LocalizationProps;

const SignInWithEmailStep: React.FC<
  SignInWithEmailStepProps & ReturnType<typeof mapDispatchToProps>
> = ({ closeModal, connectWallet, goToNextStep, goToPreviousStep, stringGetter }) => {
  const magicAuth = useMagicAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');

  const onLoginSuccess = () => {
    connectWallet({ walletType: WalletType.MagicAuth });
    goToNextStep();
  };

  const login = useCallback(async () => {
    setIsLoggingIn(true);

    try {
      await magicAuth.auth.loginWithMagicLink({ email });

      if (await magicAuth.user.isLoggedIn()) {
        onLoginSuccess();
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, magicAuth]);

  return (
    <>
      <ModalHeader
        noBorder
        title={stringGetter({ key: STRING_KEYS.SIGN_IN_WITH_EMAIL })}
      />
      <ModalContentContainer>
        <SignInWithEmailForm
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            login();
          }}
        >
          <InputField
            type={InputFieldType.Text}
            value={email}
            handleChange={setEmail}
            placeholder="user@email.com"
          />
          <Button
            fullWidth
            isLoading={isLoggingIn}
            color={ButtonColor.Purple}
            size={ButtonSize.Small}
          >
            {stringGetter({ key: STRING_KEYS.SEND_LINK })}
          </Button>
        </SignInWithEmailForm>

        <OnboardingStepFooterLinks>
          <div role="button" tabIndex={0} onClick={goToPreviousStep} onKeyDown={goToPreviousStep}>
            ← {stringGetter({ key: STRING_KEYS.GO_BACK })}
          </div>
          <div role="button" tabIndex={0} onClick={closeModal} onKeyDown={closeModal}>
            {stringGetter({ key: STRING_KEYS.SKIP_FOR_NOW })} →
          </div>
        </OnboardingStepFooterLinks>
      </ModalContentContainer>
    </>
  );
};

const SignInWithEmailForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      connectWallet: connectWalletAction,
    },
    dispatch
  );

export default withLocalization<SignInWithEmailStepProps>(
  connect(null, mapDispatchToProps)(SignInWithEmailStep)
);
