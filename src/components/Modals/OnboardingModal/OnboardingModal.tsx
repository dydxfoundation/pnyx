import React, { useState } from 'react';

import { Modal, ModalSize } from 'components/Modals';

import ChooseWalletStep from './steps/ChooseWalletStep';
import ConnectingWalletStep from './steps/ConnectingWalletStep';
import SignInWithEmailStep from './steps/SignInWithEmailStep';

enum OnboardingSteps {
  Referral = 'Referral',
  ChooseWallet = 'ChooseWallet',
  SignInWithEmail = 'SignInWithEmail',
  ConnectingWallet = 'ConnectingWallet',
  Blocked = 'Blocked',
}

export type OnboardingModalProps = {
  closeModal: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ closeModal }) => {
  const initialStep = OnboardingSteps.ChooseWallet;

  const [currentStep, setCurrentStep] = useState(initialStep);

  let step;
  switch (currentStep) {
    case OnboardingSteps.ChooseWallet: {
      step = (
        <ChooseWalletStep
          closeModal={closeModal}
          goToNextStep={() => setCurrentStep(OnboardingSteps.ConnectingWallet)}
          goToSignInWithEmailStep={() => setCurrentStep(OnboardingSteps.SignInWithEmail)}
        />
      );
      break;
    }
    case OnboardingSteps.SignInWithEmail: {
      step = (
        <SignInWithEmailStep
          closeModal={closeModal}
          goToPreviousStep={() => setCurrentStep(OnboardingSteps.ChooseWallet)}
          goToNextStep={() => setCurrentStep(OnboardingSteps.ConnectingWallet)}
        />
      );
      break;
    }
    case OnboardingSteps.ConnectingWallet: {
      step = (
        <ConnectingWalletStep
          closeModal={closeModal}
          goToPreviousStep={() => setCurrentStep(OnboardingSteps.ChooseWallet)}
        />
      );
      break;
    }
  }

  return (
    <Modal size={currentStep === OnboardingSteps.ChooseWallet ? ModalSize.Large : ModalSize.Medium}>
      {step}
    </Modal>
  );
};

export default OnboardingModal;
