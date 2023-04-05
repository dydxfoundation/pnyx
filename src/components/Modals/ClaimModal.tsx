import React, { useState } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';
import { AssetSymbol, DecimalPlaces, NotificationType } from '@/enums';

import { withLocalization } from '@/hoc';
import { usePollUnclaimedRewards, usePollWalletBalances } from '@/hooks';
import { breakpoints, fontSizes } from '@/styles';

import Button from '@/components/Button';
import WithReceipt from '@/components/WithReceipt';

import AlertMessage, { AlertMessageType } from '@/components/AlertMessage';
import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import DiffArrow, { DiffArrowColor, DiffArrowDirection } from '@/components/DiffArrow';
import LoadingSpace from '@/components/LoadingSpace';
import Tag, { TagColor } from '@/components/Tag';
import { Modal, ModalHeader, ModalSize, ModalContentContainer } from '@/components/Modals';

import { addNotification as addNotificationAction } from '@/actions/notifications';

import { getWalletAddress, getIsWalletIncorrectNetwork } from '@/selectors/wallets';
import { getUnclaimedRewardsData, getWalletBalancesData } from '@/selectors/balances';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { isErrorCancelError } from '@/lib/wallets';

import AcknowledgeModal from './AcknowledgeModal';

export type ClaimModalProps = { closeModal: () => void } & LocalizationProps;

export type ConnectedClaimModalProps = ClaimModalProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const UnconnectedClaimModal: React.FC<ConnectedClaimModalProps> = ({
  addNotification,
  closeModal,
  isWalletIncorrectNetwork,
  stringGetter,
  unclaimedRewardsData,
  walletAddress,
  walletBalancesData,
}) => {
  const [userSeenAcknowledgeModal, setUserSeenAcknowledgeModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState<string | undefined>();

  usePollUnclaimedRewards();
  usePollWalletBalances({ assetSymbol: AssetSymbol.DYDX });

  const { unclaimedRewards } = unclaimedRewardsData;
  const { balance: walletBalance } = walletBalancesData[AssetSymbol.DYDX];

  const onClickClaim = async () => {
    setIsLoading(true);

    try {
      const txHash = await contractClient.claimRewards({ walletAddress: walletAddress as string });

      addNotification({
        notificationType: NotificationType.Claim,
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

  if (!userSeenAcknowledgeModal) {
    return (
      <AcknowledgeModal
        closeModal={closeModal}
        handleOnAgree={() => setUserSeenAcknowledgeModal(true)}
      />
    );
  }

  const unclaimedRewardsBN = MustBigNumber(unclaimedRewards);

  return (
    <Modal size={ModalSize.Medium}>
      {_.isNil(unclaimedRewards) || _.isNil(walletBalance) ? (
        <LoadingSpace id="claim-modal" minHeight={16} />
      ) : (
        <>
          <ModalHeader
            noBorder
            title={stringGetter({ key: STRING_KEYS.CLAIM_YOUR_REWARDS })}
            subtitle={stringGetter({ key: STRING_KEYS.CLAIM_YOUR_REWARDS_DESCRIPTION })}
          />
          <ModalContentContainer>
            <Styled.ClaimableRewardsContainer>
              <Styled.ClaimableLabel>
                {stringGetter({ key: STRING_KEYS.CLAIMABLE })}
              </Styled.ClaimableLabel>
              <Styled.ClaimableAmount>
                <NumberFormat
                  thousandSeparator
                  displayType="text"
                  value={unclaimedRewardsBN.toFixed(DecimalPlaces.ShortToken, BigNumber.ROUND_UP)}
                />
                <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
              </Styled.ClaimableAmount>
            </Styled.ClaimableRewardsContainer>
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
            <WithReceipt
              receiptOnTop
              receiptConfig={[
                {
                  key: 'balance',
                  label: (
                    <>
                      {stringGetter({ key: STRING_KEYS.WALLET })}
                      <Tag compact marginLeft color={TagColor.Lighter}>
                        {AssetSymbol.DYDX}
                      </Tag>
                    </>
                  ),
                  value: (
                    <>
                      {MustBigNumber(walletBalance).toFixed(DecimalPlaces.ShortToken)}
                      <span>
                        <DiffArrow
                          color={DiffArrowColor.Green}
                          direction={DiffArrowDirection.Right}
                        />
                        {MustBigNumber(walletBalance)
                          .plus(unclaimedRewards)
                          .toFixed(DecimalPlaces.ShortToken, BigNumber.ROUND_UP)}
                      </span>
                    </>
                  ),
                },
              ]}
            >
              <Button
                fullWidth
                disabled={unclaimedRewardsBN.eq(0)}
                useLargeStylesOnTablet
                isLoading={isLoading}
                onClick={onClickClaim}
              >
                {stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}
              </Button>
            </WithReceipt>
          </ModalContentContainer>
        </>
      )}
    </Modal>
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.ClaimableRewardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 4rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.5rem;
`;

Styled.ClaimableLabel = styled.div`
  ${fontSizes.size14}
  color: ${({ theme }) => theme.textbase};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

Styled.ClaimableAmount = styled.div`
  ${fontSizes.size24}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textlight};

  svg {
    margin-left: 0.375rem;
  }
`;

const mapStateToProps = (state: RootState) => ({
  isWalletIncorrectNetwork: getIsWalletIncorrectNetwork(state),
  unclaimedRewardsData: getUnclaimedRewardsData(state),
  walletAddress: getWalletAddress(state),
  walletBalancesData: getWalletBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
    },
    dispatch
  );

export default withLocalization<ClaimModalProps>(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedClaimModal)
);
