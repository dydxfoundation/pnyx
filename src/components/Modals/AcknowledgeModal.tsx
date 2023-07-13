import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styled from 'styled-components';

import { LocalizationProps } from '@/types';
import { AssetSymbol, ExternalLink, StakingPool } from '@/enums';

import { breakpoints, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';

import Button, { ButtonColor } from '@/components/Button';
import { Modal, ModalHeader, ModalSize, ModalAlignedContentContainer } from '@/components/Modals';

import { STRING_KEYS } from '@/constants/localization';
import LearnMoreLink from '@/components/LearnMoreLink';

export type AcknowledgeModalProps = {
  closeModal: () => void;
  handleOnAgree: () => void;
  stakingPool?: StakingPool;
} & LocalizationProps;

export const UnconnectedAcknowledgeModal: React.FC<AcknowledgeModalProps> = ({
  closeModal,
  handleOnAgree,
  stakingPool,
  stringGetter,
}) => {
  let modalContent;

  if (stakingPool) {
    modalContent = (
      <>
        <Header
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: stringGetter({
              key: STRING_KEYS.STAKING_YOU_AGREE_TO_TERMS,
              params: {
                TERMS_LINK: ReactDOMServer.renderToString(
                  <a href={ExternalLink.TermsOfUse} target="_blank" rel="noopener noreferrer">
                    {stringGetter({ key: STRING_KEYS.TERMS_OF_USE })}
                  </a>
                ),
                PRIVACY_POLICY_LINK: ReactDOMServer.renderToString(
                  <a href={ExternalLink.PrivacyPolicy} target="_blank" rel="noopener noreferrer">
                    {stringGetter({ key: STRING_KEYS.PRIVACY_POLICY })}
                  </a>
                ),
                REVOLVING_CREDIT_AGREEMENT_LINK: ReactDOMServer.renderToString(
                  <a
                    href={ExternalLink.RevolvingCreditAgreement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stringGetter({ key: STRING_KEYS.REVOLVING_CREDIT_AGREEMENT })}
                  </a>
                ),
              },
            }),
          }}
        />
        <BulletedMessages>
          <BulletMessage>
            <BulletPoint>•</BulletPoint>
            {stringGetter({
              key: STRING_KEYS.STAKING_REPRESENT_AND_WARRANT,
              params: {
                SYMBOL: stakingPool === StakingPool.Liquidity ? AssetSymbol.USDC : AssetSymbol.DYDX,
              },
            })}
          </BulletMessage>
          <BulletMessage uppercase>
            <BulletPoint>•</BulletPoint>
            {stringGetter({ key: STRING_KEYS.DYDX_TOKEN_NOT_AVAILABLE })}
          </BulletMessage>
        </BulletedMessages>
      </>
    );
  } else {
    modalContent = (
      <BasicMessage>{stringGetter({ key: STRING_KEYS.DYDX_TOKEN_NOT_AVAILABLE })}</BasicMessage>
    );
  }

  return (
    <Modal size={stakingPool ? ModalSize.Large : ModalSize.Medium}>
      <ModalHeader
        noBorder
        title={stringGetter({
          key: stakingPool ? STRING_KEYS.ACKNOWLEDGE_TERMS : STRING_KEYS.IMPORTANT_INFORMATION,
        })}
        closeModal={closeModal}
      />
      <ModalAlignedContentContainer>
        {modalContent}
        <ButtonContainer>
          {stakingPool && (
            <Button fullWidth color={ButtonColor.Lighter} onClick={closeModal}>
              {stringGetter({ key: STRING_KEYS.CANCEL })}
            </Button>
          )}
          <Button fullWidth onClick={handleOnAgree}>
            {stringGetter({ key: STRING_KEYS.I_AGREE })}
          </Button>
        </ButtonContainer>
      </ModalAlignedContentContainer>
    </Modal>
  );
};

const Header = styled.span`
  ${fontSizes.size15};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }

  > a {
    color: ${({ theme }) => theme.colorpurple};
    text-decoration: none;
    cursor: pointer;

    &:visited {
      color: ${({ theme }) => theme.colorpurple};
    }

    &:hover {
      color: ${({ theme }) => theme.colorpurple};
      text-decoration: underline;
    }
  }
`;

const BulletedMessages = styled.div`
  margin: 1.125rem 0 1.25rem;
  padding: 1.125rem 1rem 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.layerlighter};
`;

const BulletMessage = styled.div<{ uppercase?: boolean }>`
  ${fontSizes.size14};
  display: flex;
  text-transform: ${(props) => (props.uppercase ? 'uppercase' : 'initial')};

  @media ${breakpoints.tablet} {
    ${fontSizes.size15};
  }

  &:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

const BulletPoint = styled.div`
  ${fontSizes.size24};
  line-height: 1.25rem;
  margin-right: 0.5rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size28};
  }
`;

const BasicMessage = styled.div`
  ${fontSizes.size15};
  line-height: 1.25rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
    margin-top: 0;
  }
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  > button:only-child {
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

export default withLocalization<AcknowledgeModalProps>(UnconnectedAcknowledgeModal);
