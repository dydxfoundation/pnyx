import React, { useState } from 'react';
import styled from 'styled-components';
import ReactDOMServer from 'react-dom/server';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import _ from 'lodash';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';
import {
  AssetSymbol,
  DecimalPlaces,
  DocumentationSublinks,
  ExternalLink,
  NotificationType,
  StakingPool,
} from '@/enums';

import { breakpoints, fontSizes } from '@/styles';
import { usePollEpochData, usePollWalletBalances } from '@/hooks';
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
import { Modal, ModalHeader, ModalSize, ModalContentContainer } from '@/components/Modals';

import { addNotification as addNotificationAction } from '@/actions/notifications';

import {
  getStakingBalancesData,
  getWalletBalancesData,
  getWithdrawBalancesData,
} from '@/selectors/balances';

import { getStakingPoolsData } from '@/selectors/staking-pools';
import { getWalletAddress, getIsWalletIncorrectNetwork } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { calculateUserStakingBalance } from '@/lib/staking-pools';
import { isErrorCancelError } from '@/lib/wallets';

export type RequestWithdrawModalProps = {
  closeModal: () => void;
  stakingPool?: StakingPool;
} & LocalizationProps;

export type ConnectedRequestWithdrawModalProps = RequestWithdrawModalProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const UnconnectedRequestWithdrawModal: React.FC<ConnectedRequestWithdrawModalProps> = ({
  addNotification,
  isWalletIncorrectNetwork,
  closeModal,
  stakingBalancesData,
  stakingPool = StakingPool.Liquidity,
  stakingPoolsData,
  stringGetter,
  walletAddress,
  walletBalancesData,
  withdrawBalancesData,
}) => {
  const [requestWithdrawAmount, setRequestWithdrawAmount] = useState<string>('');
  const [isCtaLoading, setIsCtaLoading] = useState<boolean>(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState<string | undefined>();

  const assetSymbol = stakingPool === StakingPool.Liquidity ? AssetSymbol.USDC : AssetSymbol.DYDX;

  usePollWalletBalances({ assetSymbol });
  usePollEpochData({ stakingPool });

  const { currentlyInBlackoutWindow, nextEpochDate } = stakingPoolsData.data[stakingPool];
  const { pendingWithdrawBalance } = withdrawBalancesData[stakingPool];

  const onClickRequestWithdraw = async () => {
    try {
      setIsCtaLoading(true);

      const txHash = await contractClient.stakingPoolClient?.requestWithdraw({
        amount: requestWithdrawAmount,
        stakingPool,
        walletAddress: walletAddress as string,
      });

      addNotification({
        notificationType: NotificationType.RequestWithdraw,
        notificationData: {
          amount: requestWithdrawAmount,
          symbol: assetSymbol,
          txHash,
        },
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

  const { balance: walletBalance } = walletBalancesData[assetSymbol];

  const userStakingBalance = calculateUserStakingBalance({
    stakingBalancesData,
    stakingPool,
    withdrawBalancesData,
  });

  const isRequestWithdrawAmountEmpty = MustBigNumber(requestWithdrawAmount).eq(0);
  const isRequestWithdrawLessThanBalance = MustBigNumber(requestWithdrawAmount).lte(
    userStakingBalance || 0
  );

  const isRequestWithdrawAmountValid =
    !isRequestWithdrawAmountEmpty && isRequestWithdrawLessThanBalance;

  const isCtaDisabled =
    isWalletIncorrectNetwork || !isRequestWithdrawAmountValid || currentlyInBlackoutWindow;

  const nextEpochDateFormatted = DateTime.fromISO(nextEpochDate || '').toLocaleString(
    DateTime.DATETIME_SHORT
  );

  let errorMessage;
  if (currentlyInBlackoutWindow) {
    errorMessage = (
      <>
        {stringGetter({
          key: STRING_KEYS.LIQUIDITY_POOL_CURRENT_BLACKOUT_WINDOW,
          params: {
            EPOCH_DATE: nextEpochDateFormatted,
          },
        })}{' '}
        <LearnMoreLink
          color={LinkColor.LightText}
          href={`${ExternalLink.Documentation}${
            stakingPool === StakingPool.Liquidity
              ? DocumentationSublinks.LiquidityPool
              : DocumentationSublinks.SafetyPool
          }`}
        />
      </>
    );
  } else if (isWalletIncorrectNetwork) {
    errorMessage = stringGetter({ key: STRING_KEYS.WRONG_NETWORK });
  } else if (!isRequestWithdrawLessThanBalance) {
    errorMessage = stringGetter({ key: STRING_KEYS.REQUEST_WITHDRAW_MORE_THAN_BALANCE });
  }

  const buttonReceiptConfig = [
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
          {!isRequestWithdrawAmountEmpty && (
            <span>
              <DiffArrow color={DiffArrowColor.Green} direction={DiffArrowDirection.Right} />
              {MustBigNumber(walletBalance)
                .plus(requestWithdrawAmount)
                .toFixed(DecimalPlaces.ShortToken)}
            </span>
          )}
        </>
      ),
    },
  ];

  if (!currentlyInBlackoutWindow) {
    buttonReceiptConfig.unshift({
      key: 'available-at',
      label: (stringGetter({ key: STRING_KEYS.AVAILABLE_AT }) as unknown) as JSX.Element,
      value: ((nextEpochDate ? nextEpochDateFormatted : '-') as unknown) as JSX.Element,
    });
  }

  return (
    <Modal size={ModalSize.Medium}>
      {_.isNil(userStakingBalance) || _.isNil(walletBalance) || _.isNil(nextEpochDate) ? (
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
                    key: STRING_KEYS.WITHDRAW_FROM_POOL,
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
                        {userStakingBalance
                          .minus(pendingWithdrawBalance || 0)
                          .toFixed(DecimalPlaces.ShortToken)}
                        {!isRequestWithdrawAmountEmpty && (
                          <DiffSpan red={!isRequestWithdrawAmountValid}>
                            <DiffArrow
                              color={DiffArrowColor.Red}
                              direction={DiffArrowDirection.Right}
                            />
                            {userStakingBalance
                              .minus(requestWithdrawAmount)
                              .toFixed(DecimalPlaces.ShortToken)}
                          </DiffSpan>
                        )}
                      </>
                    ),
                  },
                ]}
              >
                <InputField
                  value={requestWithdrawAmount}
                  handleChange={(newValue: string) => setRequestWithdrawAmount(newValue)}
                  onClickMax={() => {
                    setRequestWithdrawAmount(userStakingBalance.toString());
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
            {!currentlyInBlackoutWindow && (
              <InfoBox
                title={stringGetter({ key: STRING_KEYS.REQUESTING_WITHDRAWALS })}
                body={
                  <>
                    {stringGetter({ key: STRING_KEYS.REQUESTING_WITHDRAWALS_DESCRIPTION })}{' '}
                    <LearnMoreLink
                      href={`${ExternalLink.Documentation}${
                        stakingPool === StakingPool.Liquidity
                          ? DocumentationSublinks.LiquidityPool
                          : DocumentationSublinks.SafetyPool
                      }`}
                    />
                  </>
                }
              />
            )}
            <WithReceipt receiptOnTop receiptConfig={buttonReceiptConfig}>
              <Button
                fullWidth
                onClick={onClickRequestWithdraw}
                disabled={isCtaDisabled}
                isLoading={isCtaLoading}
              >
                {stringGetter({ key: STRING_KEYS.REQUEST_WITHDRAW })}
              </Button>
            </WithReceipt>
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
  isWalletIncorrectNetwork: getIsWalletIncorrectNetwork(state),
  stakingBalancesData: getStakingBalancesData(state),
  stakingPoolsData: getStakingPoolsData(state),
  walletAddress: getWalletAddress(state),
  walletBalancesData: getWalletBalancesData(state),
  withdrawBalancesData: getWithdrawBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
    },
    dispatch
  );

export default withLocalization<RequestWithdrawModalProps>(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedRequestWithdrawModal)
);
