import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import {
  AssetSymbol,
  DecimalPlaces,
  DocumentationSublinks,
  ExternalLink,
  NotificationType,
} from '@/enums';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { usePollGovernancePowersData } from '@/hooks';
import { breakpoints, fontSizes } from '@/styles';

import Button from '@/components/Button';
import LearnMoreLink from '@/components/LearnMoreLink';
import LoadingSpace from '@/components/LoadingSpace';

import AlertMessage, { AlertMessageType } from '@/components/AlertMessage';
import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';

import {
  Modal,
  ModalHeader,
  ModalSize,
  ModalContentContainer,
  ModalInfoFooter,
} from '@/components/Modals';

import { setVotedOnProposal as setVotedOnProposalAction } from '@/actions/governance';
import { addNotification as addNotificationAction } from '@/actions/notifications';

import { getIsWalletIncorrectNetwork, getWalletAddress } from '@/selectors/wallets';
import { getGovernancePowersData } from '@/selectors/governance';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { isErrorCancelError } from '@/lib/wallets';

export type VoteModalProps = { closeModal: () => void; proposalId?: number } & LocalizationProps;

export type ConnectedVoteModalProps = VoteModalProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const UnconnectedVoteModal: React.FC<ConnectedVoteModalProps> = ({
  addNotification,
  closeModal,
  governancePowersData,
  isWalletIncorrectNetwork,
  proposalId,
  setVotedOnProposal,
  stringGetter,
  walletAddress,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voteFor, setVoteFor] = useState<boolean>(true);
  const [walletErrorMessage, setWalletErrorMessage] = useState<string | undefined>();

  const { votingPower } = governancePowersData;

  usePollGovernancePowersData();

  useEffect(() => {
    if (_.isNil(proposalId)) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickVote = async () => {
    setIsLoading(true);

    try {
      const txHash = await contractClient.governanceClient.voteOnProposal({
        proposalId: proposalId as number,
        voteFor,
        walletAddress: walletAddress as string,
      });

      setVotedOnProposal({ proposalId: proposalId as number, votedFor: voteFor, hasVoted: true });

      addNotification({
        notificationType: NotificationType.Vote,
        notificationData: { txHash },
      });

      closeModal();
    } catch (error) {
      console.error(error);

      if (!isErrorCancelError({ error })) {
        setWalletErrorMessage(error.message || stringGetter({ key: STRING_KEYS.UNKNOWN_ERROR }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  let errorMessage;
  if (isWalletIncorrectNetwork) {
    errorMessage = stringGetter({ key: STRING_KEYS.WRONG_NETWORK });
  }

  return (
    <Modal size={ModalSize.Medium}>
      {_.isNil(votingPower) ? (
        <LoadingSpace id="vote-modal" minHeight={16} />
      ) : (
        <>
          <ModalHeader
            noBorder
            title={stringGetter({ key: STRING_KEYS.VOTE_ON_PROPOSAL })}
            subtitle={
              <>
                {stringGetter({ key: STRING_KEYS.VOTE_ON_PROPOSAL_DESCRIPTION })}{' '}
                <LearnMoreLink
                  href={`${ExternalLink.Documentation}${DocumentationSublinks.Voting}`}
                />
              </>
            }
          />
          <ModalContentContainer>
            <VoteSideSelector>
              <VoteSideOption isVoteFor active={voteFor} onClick={() => setVoteFor(true)}>
                {stringGetter({ key: STRING_KEYS.FOR })}
              </VoteSideOption>
              <VoteSideOption active={!voteFor} onClick={() => setVoteFor(false)}>
                {stringGetter({ key: STRING_KEYS.AGAINST })}
              </VoteSideOption>
            </VoteSideSelector>
            <VotingPowerContainer>
              <VotingPowerLabel>{stringGetter({ key: STRING_KEYS.VOTING_POWER })}</VotingPowerLabel>
              <VotingPowerAmount>
                <NumberFormat
                  thousandSeparator
                  displayType="text"
                  value={MustBigNumber(votingPower).toFixed(
                    DecimalPlaces.ShortToken,
                    BigNumber.ROUND_UP
                  )}
                />
                <AssetIcon dark size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
              </VotingPowerAmount>
            </VotingPowerContainer>
            {(errorMessage || walletErrorMessage) && (
              <AlertMessage
                type={AlertMessageType.Error}
                message={
                  walletErrorMessage
                    ? stringGetter({
                        key: STRING_KEYS.SOMETHING_WENT_WRONG,
                        params: { ERROR_MESSAGE: walletErrorMessage },
                      })
                    : errorMessage
                }
              />
            )}
            <ButtonContainer>
              <Button
                fullWidth
                isLoading={isLoading}
                onClick={onClickVote}
                disabled={isWalletIncorrectNetwork}
              >
                {stringGetter({ key: STRING_KEYS.VOTE })}
              </Button>
            </ButtonContainer>
            <ModalInfoFooter>
              {stringGetter({ key: STRING_KEYS.VOTE_CANNOT_BE_CHANGED })}
            </ModalInfoFooter>
          </ModalContentContainer>
        </>
      )}
    </Modal>
  );
};

const VoteSideSelector = styled.div`
  ${fontSizes.size16}
  display: flex;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.layermediumlight};
  height: 2.5rem;
  margin-bottom: 1rem;
  user-select: none;

  @media ${breakpoints.tablet} {
    ${fontSizes.size18}
    height: 3rem;
  }
`;

const VoteSideOption = styled.div<{ active: boolean; isVoteFor?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  height: 100%;
  padding: 0 1rem;
  cursor: pointer;
  border-radius: 0.5rem;

  color: ${(props) => {
    if (props.active) {
      return props.isVoteFor ? props.theme.colorgreen : props.theme.colorred;
    }

    return props.theme.textdark;
  }};

  background-color: ${(props) =>
    props.active ? props.theme.layerlighter : props.theme.layermediumlight};
`;

const VotingPowerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  background-color: ${({ theme }) => theme.layerlighter};
  border-radius: 0.5rem;
`;

const VotingPowerLabel = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textbase};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

const VotingPowerAmount = styled.div`
  ${fontSizes.size24}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textlight};

  svg {
    margin-left: 0.375rem;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0.75rem;
`;

const mapStateToProps = (state: RootState) => ({
  governancePowersData: getGovernancePowersData(state),
  isWalletIncorrectNetwork: getIsWalletIncorrectNetwork(state),
  walletAddress: getWalletAddress(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
      setVotedOnProposal: setVotedOnProposalAction,
    },
    dispatch
  );

export default withLocalization<VoteModalProps>(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedVoteModal)
);
