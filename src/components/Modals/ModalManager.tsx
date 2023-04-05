import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ModalType } from '@/enums';
import { ModalConfig } from '@/types';
import { AppDispatch, RootState } from '@/store';

import LoadingSpace from '@/components/LoadingSpace';

import { closeModal as closeModalAction } from '@/actions/modals';
import { getModalConfig } from '@/selectors/modals';

import { Modal, ModalOverlay } from './Modal';

const ClaimModal = lazy(() => import('./ClaimModal'));
const DelegateModal = lazy(() => import('./DelegateModal'));
const OnboardingModal = lazy(() => import('./OnboardingModal/OnboardingModal'));
const RequestWithdrawModal = lazy(() => import('./RequestWithdrawModal'));
const StakeModal = lazy(() => import('./StakeModal/StakeModal'));
const TradeLinkModal = lazy(() => import('./TradeLinkModal'));
const VoteModal = lazy(() => import('./VoteModal'));

export type ModalManagerProps = {
  modalConfig: ModalConfig;
};

const ModalManager: React.FC<ModalManagerProps & ReturnType<typeof mapDispatchToProps>> = ({
  modalConfig,
  closeModal,
}) => {
  if (!modalConfig) {
    return null;
  }

  const { type, props: modalConfigProps } = modalConfig;

  const handleCloseModal = () => closeModal({ type: modalConfig.type });

  const modalProps: {
    key: ModalType;
    closeModal: () => void;
    onClickOutside?: React.MouseEventHandler<HTMLDivElement>;
  } = {
    key: type,
    closeModal: handleCloseModal,
    ...modalConfigProps,
  };

  let component;

  switch (type) {
    case ModalType.Claim: {
      component = <ClaimModal {...modalProps} />;
      break;
    }
    case ModalType.Delegate: {
      component = <DelegateModal {...modalProps} />;
      break;
    }
    case ModalType.Onboarding: {
      component = <OnboardingModal {...modalProps} />;
      break;
    }
    case ModalType.RequestWithdraw: {
      component = <RequestWithdrawModal {...modalProps} />;
      break;
    }
    case ModalType.Stake: {
      component = <StakeModal {...modalProps} />;
      break;
    }
    case ModalType.TradeLink: {
      component = <TradeLinkModal {...modalProps} />;
      break;
    }
    case ModalType.Vote: {
      component = <VoteModal {...modalProps} />;
      break;
    }
    default:
      return null;
  }

  return (
    <ModalOverlay
      key={type}
      onClickOutside={(e) => {
        modalProps.onClickOutside?.(e);
        handleCloseModal();
      }}
    >
      <Suspense
        fallback={
          <Modal>
            <LoadingSpace minHeight={18} />
          </Modal>
        }
      >
        {component}
      </Suspense>
    </ModalOverlay>
  );
};

const mapStateToProps = (state: RootState) => ({
  modalConfig: getModalConfig(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      closeModal: closeModalAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ModalManager);
