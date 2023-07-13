import React, { useState } from 'react';
import styled from 'styled-components';
import ReactDOMServer from 'react-dom/server';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  AssetSymbol,
  DecimalPlaces,
  DocumentationSublinks,
  ExternalLink,
  NotificationType,
  StakingPool,
} from '@/enums';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';

import { breakpoints, fontSizes } from '@/styles';
import { usePollAllowance, usePollWalletBalances } from '@/hooks';
import { withLocalization } from '@/hoc';

import Button from '@/components/Button';
import InfoBox from '@/components/InfoBox';
import InputField from '@/components/InputField';
import WithReceipt from '@/components/WithReceipt';

import AlertMessage, { AlertMessageType } from '@/components/AlertMessage';
import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import DiffArrow, { DiffArrowColor, DiffArrowDirection } from '@/components/DiffArrow';
import LearnMoreLink, { LinkColor } from '@/components/LearnMoreLink';
import LoadingSpace from '@/components/LoadingSpace';
import Tag, { TagColor } from '@/components/Tag';
import WithLabel, { WithLabelColor } from '@/components/WithLabel';

import {
  Modal,
  ModalHeader,
  ModalSize,
  ModalContentContainer,
  ModalInfoFooter,
} from '@/components/Modals';

import {
  setAllowance as setAllowanceAction,
  setUserSentAllowanceTransaction as setUserSentAllowanceTransactionAction,
} from '@/actions/allowances';

import { addNotification as addNotificationAction } from '@/actions/notifications';

import { getAllowances } from '@/selectors/allowances';
import { getStakingBalancesData, getWalletBalancesData } from '@/selectors/balances';
import { getWalletAddress, getIsWalletIncorrectNetwork } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { isErrorCancelError } from '@/lib/wallets';
import { LOCAL_STORAGE_KEYS, setLocalStorage, getLocalStorage } from '@/lib/local-storage';

import AcknowledgeModal from '../AcknowledgeModal';
import SetAllowanceModule from './SetAllowanceModule';

export type StakeModalProps = {
  closeModal: () => void;
  stakingPool?: StakingPool;
} & LocalizationProps;

export type ConnectedStakeModalProps = StakeModalProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const UnconnectedStakeModal: React.FC<ConnectedStakeModalProps> = ({
  addNotification,
  allowances,
  isWalletIncorrectNetwork,
  closeModal,
  setAllowance,
  setUserSentAllowanceTransaction,
  stakingBalancesData,
  stakingPool = StakingPool.Liquidity,
  stringGetter,
  walletAddress,
  walletBalancesData,
}) => {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [userSeenAcknowledgeModal, setUserSeenAcknowledgeModal] = useState<boolean>(false);
  const [isCtaLoading, setIsCtaLoading] = useState<boolean>(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState<string | undefined>();

  const assetSymbol = stakingPool === StakingPool.Liquidity ? AssetSymbol.USDC : AssetSymbol.DYDX;

  usePollAllowance({
    allowances,
    setAllowance,
    stakingPool,
    walletAddress: walletAddress as string,
  });

  usePollWalletBalances({ assetSymbol });

  const onClickStake = async () => {
    try {
      setIsCtaLoading(true);

      const txHash = await contractClient.stakingPoolClient?.stake({
        amount: stakeAmount,
        hardcodeGas: userSentAllowanceTransaction,
        stakingPool,
        walletAddress: walletAddress as string,
      });

      addNotification({
        notificationType: NotificationType.Stake,
        notificationData: { amount: stakeAmount, symbol: assetSymbol, txHash },
      });

      closeModal();
    } catch (error) {
      console.error(error);

      if (!isErrorCancelError({ error })) {
        setWalletErrorMessage(error.message || stringGetter({ key: STRING_KEYS.UNKNOWN_ERROR }));
      }
    } finally {
      setIsCtaLoading(false);
    }
  };

  const { allowance: poolAllowance, userSentAllowanceTransaction } = allowances[stakingPool];
  const { userBalance } = stakingBalancesData.balances[stakingPool];
  const { balance: walletBalance } = walletBalancesData[assetSymbol];

  const isAllowanceSet = MustBigNumber(poolAllowance).gt(0);

  const isStakeAmountEmpty = MustBigNumber(stakeAmount).eq(0);
  const isStakeLessThanBalance = MustBigNumber(stakeAmount).lte(walletBalance || 0);
  const isStakeAmountValid = !isStakeAmountEmpty && isStakeLessThanBalance;

  const showAllowanceModule = !isAllowanceSet && !userSentAllowanceTransaction;

  const isCtaDisabled =
    isWalletIncorrectNetwork ||
    !isStakeAmountValid ||
    (!userSentAllowanceTransaction && !isAllowanceSet);

  let errorMessage;
  if (isWalletIncorrectNetwork) {
    errorMessage = stringGetter({ key: STRING_KEYS.WRONG_NETWORK });
  } else if (!showAllowanceModule) {
    if (!isStakeLessThanBalance) {
      errorMessage = stringGetter({ key: STRING_KEYS.STAKE_MORE_THAN_BALANCE });
    }
  }

  const acknowledgeLocalStorageKey =
    stakingPool === StakingPool.Liquidity
      ? LOCAL_STORAGE_KEYS.ACKNOWLEDGE_TERMS_LIQUIDITY_POOL
      : LOCAL_STORAGE_KEYS.ACKNOWLEDGE_TERMS_STAKING_POOL;

  const hasUserAcknowledgedTerms = getLocalStorage({ key: acknowledgeLocalStorageKey });

  if (!userSeenAcknowledgeModal) {
    return (
      <AcknowledgeModal
        closeModal={closeModal}
        handleOnAgree={() => {
          if (!hasUserAcknowledgedTerms) {
            setLocalStorage({ key: acknowledgeLocalStorageKey, value: true });
          }

          setUserSeenAcknowledgeModal(true);
        }}
        stakingPool={hasUserAcknowledgedTerms ? undefined : stakingPool}
      />
    );
  }

  return (
    <Modal size={ModalSize.Medium}>
      {_.isNil(poolAllowance) || _.isNil(walletBalance) ? (
        <LoadingSpace minHeight={16} />
      ) : (
        <>
          <ModalHeader
            dark
            noBorder
            closeModal={closeModal}
            title={
              <SpanWithLightEmbed
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: stringGetter({
                    key: STRING_KEYS.STAKE_ON_POOL,
                    params: {
                      POOL_ELEMENT: ReactDOMServer.renderToString(
                        <span>
                          {stringGetter({
                            key:
                              stakingPool === StakingPool.Liquidity
                                ? STRING_KEYS.LIQUIDITY_POOL
                                : STRING_KEYS.SAFETY_POOL,
                          })}
                        </span>
                      ),
                    },
                  }),
                }}
              />
            }
          />
          <ModalContentContainer>
            <WithLabel color={WithLabelColor.Base} label={stringGetter({ key: STRING_KEYS.ASSET })}>
              <AssetContainer>
                <AssetIcon dark size={AssetIconSize.Small} symbol={assetSymbol} />
                {stakingPool === StakingPool.Liquidity ? 'USD Coin' : 'DYDX Token'}
                <Tag marginLeft>{assetSymbol}</Tag>
              </AssetContainer>
            </WithLabel>
            <WithLabel
              noMargin
              color={WithLabelColor.Dark}
              label={stringGetter({ key: STRING_KEYS.AMOUNT })}
            >
              <WithReceipt
                receiptConfig={[
                  {
                    key: 'wallet-balance',
                    label: (
                      <>
                        {stringGetter({ key: STRING_KEYS.WALLET })}
                        <Tag compact marginLeft color={TagColor.Lighter}>
                          {assetSymbol}
                        </Tag>
                      </>
                    ),
                    value: (
                      <>
                        {MustBigNumber(walletBalance).toFixed(DecimalPlaces.ShortToken)}
                        {!isStakeAmountEmpty && (
                          <DiffSpan red={!isStakeAmountValid}>
                            <DiffArrow
                              color={DiffArrowColor.Red}
                              direction={DiffArrowDirection.Right}
                            />
                            {MustBigNumber(walletBalance)
                              .minus(stakeAmount)
                              .toFixed(DecimalPlaces.ShortToken)}
                          </DiffSpan>
                        )}
                      </>
                    ),
                  },
                ]}
              >
                <InputField
                  value={stakeAmount}
                  handleChange={(newValue: string) => {
                    setStakeAmount(newValue);
                    setWalletErrorMessage(undefined);
                  }}
                  onClickMax={() => {
                    setStakeAmount(walletBalance as string);
                    setWalletErrorMessage(undefined);
                  }}
                />
              </WithReceipt>
            </WithLabel>
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
            {showAllowanceModule ? (
              <SetAllowanceModule
                assetSymbol={assetSymbol}
                isWalletIncorrectNetwork={isWalletIncorrectNetwork}
                setSentAllowanceTransaction={() => setUserSentAllowanceTransaction({ stakingPool })}
                stakingPool={stakingPool}
                walletAddress={walletAddress as string}
              />
            ) : (
              <InfoBox
                title={stringGetter({ key: STRING_KEYS.ABOUT_WITHDRAWALS })}
                body={stringGetter({ key: STRING_KEYS.ABOUT_WITHDRAWALS_DESCRIPTION })}
              />
            )}
            <WithReceipt
              receiptOnTop
              receiptConfig={[
                {
                  key: 'staked',
                  label: (
                    <>
                      {stringGetter({ key: STRING_KEYS.STAKED })}
                      <Tag compact marginLeft color={TagColor.Lighter}>
                        {assetSymbol}
                      </Tag>
                    </>
                  ),
                  value: (
                    <>
                      {MustBigNumber(userBalance).toFixed(DecimalPlaces.ShortToken)}
                      {!isStakeAmountEmpty && (
                        <span>
                          <DiffArrow
                            color={DiffArrowColor.Green}
                            direction={DiffArrowDirection.Right}
                          />
                          {MustBigNumber(userBalance)
                            .plus(stakeAmount)
                            .toFixed(DecimalPlaces.ShortToken)}
                        </span>
                      )}
                    </>
                  ),
                },
              ]}
            >
              <Button
                fullWidth
                onClick={onClickStake}
                disabled={isCtaDisabled}
                isLoading={isCtaLoading}
              >
                {stringGetter({ key: STRING_KEYS.STAKE_FUNDS })}
              </Button>
            </WithReceipt>
            <ModalInfoFooter>
              {stringGetter({ key: STRING_KEYS.THERE_ARE_RISKS, params: { SYMBOL: assetSymbol } })}{' '}
              <LearnMoreLink
                color={LinkColor.BaseText}
                href={`${ExternalLink.Documentation}${
                  stakingPool === StakingPool.Liquidity
                    ? DocumentationSublinks.LiquidityPool
                    : DocumentationSublinks.SafetyPool
                }`}
              />
            </ModalInfoFooter>
          </ModalContentContainer>
        </>
      )}
    </Modal>
  );
};

const SpanWithLightEmbed = styled.span`
  > span {
    color: ${({ theme }) => theme.textlight};
  }
`;

const AssetContainer = styled.div`
  ${fontSizes.size16}
  display: flex;
  align-items: center;
  height: 2.5rem;
  width: 100%;
  background-color: ${({ theme }) => theme.layermediumlight};
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  color: ${({ theme }) => theme.textlight};

  @media ${breakpoints.tablet} {
    ${fontSizes.size18}
    height: 3rem;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const DiffSpan = styled.span<{ red?: boolean }>`
  color: ${(props) => (props.red ? props.theme.colorred : 'inherit')};
`;

const mapStateToProps = (state: RootState) => ({
  allowances: getAllowances(state),
  isWalletIncorrectNetwork: getIsWalletIncorrectNetwork(state),
  stakingBalancesData: getStakingBalancesData(state),
  walletAddress: getWalletAddress(state),
  walletBalancesData: getWalletBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
      setAllowance: setAllowanceAction,
      setUserSentAllowanceTransaction: setUserSentAllowanceTransactionAction,
    },
    dispatch
  );

export default withLocalization<StakeModalProps>(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedStakeModal)
);
