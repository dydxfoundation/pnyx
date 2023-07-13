import React from 'react';
import styled from 'styled-components';

import { LocalizationProps } from '@/types';
import { ExternalLink } from '@/enums';

import { withLocalization } from '@/hoc';
import { breakpoints, fontSizes } from '@/styles';

import Button from '@/components/Button';
import { Modal, ModalHeader, ModalSize, ModalContentContainer } from '@/components/Modals';

import { STRING_KEYS } from '@/constants/localization';

export type TradeLinkModalProps = {
  closeModal: () => void;
} & LocalizationProps;

export type ConnectedTradeLinkModalProps = TradeLinkModalProps;

export const UnconnectedTradeLinkModal: React.FC<ConnectedTradeLinkModalProps> = ({
  closeModal,
  stringGetter,
}) => (
  <Modal size={ModalSize.Medium}>
    <ModalHeader
      noBorder
      title={stringGetter({ key: STRING_KEYS.LEAVING_WEBSITE })}
      closeModal={closeModal}
    />
    <ModalContentContainer>
      <Message>{stringGetter({ key: STRING_KEYS.LEAVING_DYDX_FOUNDATION_WEBSITE })}</Message>
      <Button linkOutIcon href={ExternalLink.TradeApp} onClick={() => closeModal()}>
        {stringGetter({ key: STRING_KEYS.TRADE })}
      </Button>
    </ModalContentContainer>
  </Modal>
);

const Message = styled.div`
  ${fontSizes.size15};
  line-height: 1.25rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
    margin-top: 0;
  }
`;

export default withLocalization<TradeLinkModalProps>(UnconnectedTradeLinkModal);
