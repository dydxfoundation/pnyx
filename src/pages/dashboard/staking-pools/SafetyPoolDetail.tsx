import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DateTime } from 'luxon';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

import {
  AssetSymbol,
  DecimalPlaces,
  DocumentationSublinks,
  ExternalLink,
  ModalType,
  NotificationType,
  StakingPool,
} from '@/enums';

import { AppDispatch, RootState } from '@/store';
import { LocalizationProps } from '@/types';

import {
  useGetCountdownDiff,
  usePollEpochData,
  usePollStakingBalances,
  usePollStakingPoolsData,
  usePollWithdrawBalances,
} from '@/hooks';

import { withLocalization } from '@/hoc';
import { breakpoints } from '@/styles';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import Button, { ButtonColor, ButtonContainer } from '@/components/Button';
import GeoBlockBanner from '@/components/GeoBlockBanner';
import SectionHeader from '@/components/SectionHeader';
import { SingleStatCard, CardColor, ValueWithIcon } from '@/components/Cards';

import CollapsibleSection from '@/components/CollapsibleSection';
import DetailPageHeader from '@/components/DetailPageHeader';
import SectionWrapper from '@/components/SectionWrapper';

import { openModal as openModalAction } from '@/actions/modals';
import { addNotification as addNotificationAction } from '@/actions/notifications';

import { getStakingBalancesData, getWithdrawBalancesData } from '@/selectors/balances';

import { getStakingPoolsData } from '@/selectors/staking-pools';
import { getWalletAddress } from '@/selectors/wallets';
import { getIsUserGeoBlocked } from '@/selectors/geo';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { BIG_NUMBERS, MustBigNumber } from '@/lib/numbers';
import { calculateUserStakingBalance } from '@/lib/staking-pools';

import { DetailPageLayoutContainer, ContentLeft, ContentRight, CardRow } from '../DetailPageStyles';

const FIFTEEN_MINUTES_SECONDS = 15 * 60;

type SafetyPoolDetailProps = {} & LocalizationProps;

const SafetyPoolDetail: React.FC<
  SafetyPoolDetailProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> = ({
  addNotification,
  isUserGeoBlocked,
  openModal,
  stakingBalancesData,
  stakingPoolsData,
  stringGetter,
  walletAddress,
  withdrawBalancesData,
}) => {
  const [isLoadingWithdrawAvailable, setIsLoadingWithdrawAvailable] = useState<boolean>(false);

  usePollStakingPoolsData();
  usePollStakingBalances();

  usePollEpochData({ stakingPool: StakingPool.Safety });
  usePollWithdrawBalances({ stakingPool: StakingPool.Safety });

  const { userBalance, unclaimedRewards } = stakingBalancesData.balances[StakingPool.Safety];

  const {
    nextEpochDate,
    lengthOfBlackoutWindow,
    poolSize,
    rewardsPerSecond,
  } = stakingPoolsData.data[StakingPool.Safety];

  const formattedDiffUntilEpoch = useGetCountdownDiff({
    futureDateISO: nextEpochDate,
    stringGetter,
  });

  const blackoutWindowStartTime = DateTime.fromISO(nextEpochDate ?? '').minus({
    seconds: Number(lengthOfBlackoutWindow ?? 0),
  });

  const { seconds: secondsUntilBlackoutWindow } = blackoutWindowStartTime.diff(
    DateTime.local(),
    'seconds'
  );

  const formattedDiffUntilBlackoutWindow = useGetCountdownDiff({
    futureDateISO: blackoutWindowStartTime.toISO(),
    stringGetter,
  });

  const { availableWithdrawBalance, pendingWithdrawBalance } = withdrawBalancesData[
    StakingPool.Safety
  ];

  const userStakingBalance = calculateUserStakingBalance({
    stakingBalancesData,
    stakingPool: StakingPool.Safety,
    withdrawBalancesData,
  });

  const userHasStakingBalance = walletAddress && userStakingBalance?.gt(0);

  const handleOnClickWithdrawAvailable = async () => {
    try {
      setIsLoadingWithdrawAvailable(true);

      const txHash = await contractClient.stakingPoolClient.withdrawAvailableBalance({
        amount: availableWithdrawBalance,
        stakingPool: StakingPool.Safety,
        walletAddress: walletAddress as string,
      });

      addNotification({
        notificationType: NotificationType.Withdraw,
        notificationData: { txHash },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingWithdrawAvailable(false);
    }
  };

  let formattedUserBalance: React.ReactNode = '-';
  let formattedEarnings: React.ReactNode = '-';
  let formattedAvailableWithdrawBalance: React.ReactNode = '-';
  let formattedPendingWithdrawBalance: React.ReactNode = '-';

  if (walletAddress) {
    if (userStakingBalance) {
      formattedUserBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={userStakingBalance.toFixed(DecimalPlaces.ShortToken)}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }

    if (unclaimedRewards) {
      formattedEarnings = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(unclaimedRewards).toFixed(
              DecimalPlaces.ShortToken,
              BigNumber.ROUND_UP
            )}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }

    if (availableWithdrawBalance) {
      formattedAvailableWithdrawBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(availableWithdrawBalance).toFixed(DecimalPlaces.ShortToken)}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }

    if (pendingWithdrawBalance) {
      formattedPendingWithdrawBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(pendingWithdrawBalance).toFixed(DecimalPlaces.ShortToken)}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }
  }

  return (
    <SectionWrapper column>
      <DetailPageHeader
        label={stringGetter({ key: STRING_KEYS.POOL })}
        title={stringGetter({ key: STRING_KEYS.SAFETY_POOL })}
        subtitle={stringGetter({ key: STRING_KEYS.SAFETY_POOL_INACTIVE_DESCRIPTION })}
      />
      {isUserGeoBlocked && (
        <Styled.BannerContainer>
          <GeoBlockBanner />
        </Styled.BannerContainer>
      )}
      <DetailPageLayoutContainer>
        <ContentLeft>
          <CardRow>
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.POOL_SIZE })}
              value={
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(poolSize).toFixed(DecimalPlaces.None, BigNumber.ROUND_UP)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.CURRENTLY_BEING_STAKED })}
              isLoading={!poolSize}
            />
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.CURRENT_APR })}
              value={
                <NumberFormat
                  thousandSeparator
                  displayType="text"
                  suffix="%"
                  value={BIG_NUMBERS.ZERO.toFixed(DecimalPlaces.Percent)}
                />
              }
              label={stringGetter({ key: STRING_KEYS.ESTIMATED_APR_IN_DYDX })}
              isLoading={!rewardsPerSecond || !poolSize}
            />
          </CardRow>
          <CardRow>
            <SingleStatCard
              color={walletAddress ? CardColor.Light : CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.STAKED })}
              value={formattedUserBalance}
              label={
                userHasStakingBalance
                  ? stringGetter({
                      key: STRING_KEYS.YOUR_STAKE,
                    })
                  : stringGetter({
                      key: STRING_KEYS.THIS_POOL_ACCEPTS_SYMBOL,
                      params: { SYMBOL: AssetSymbol.DYDX },
                    })
              }
              isLoading={!!walletAddress && (!userBalance || !availableWithdrawBalance)}
            />
            {!isUserGeoBlocked && (
              <SingleStatCard
                color={walletAddress ? CardColor.Light : CardColor.Dark}
                title={stringGetter({ key: STRING_KEYS.EARNED })}
                value={formattedEarnings}
                label={stringGetter({
                  key: userHasStakingBalance
                    ? STRING_KEYS.UNCLAIMED_REWARDS
                    : STRING_KEYS.STAKE_TO_EARN_REWARDS,
                })}
                ctaConfig={
                  MustBigNumber(unclaimedRewards).gt(0)
                    ? {
                        disabled: !walletAddress,
                        label: stringGetter({ key: STRING_KEYS.CLAIM }),
                        onClick: () => openModal({ type: ModalType.Claim }),
                      }
                    : undefined
                }
                isLoading={!!walletAddress && !unclaimedRewards}
              />
            )}
          </CardRow>
          {walletAddress && (
            <Styled.WithdrawSection>
              <SectionHeader
                title={stringGetter({ key: STRING_KEYS.WITHDRAWS })}
                subtitle={stringGetter({ key: STRING_KEYS.WITHDRAWS_DESCRIPTION })}
              />
              <Styled.WithdrawCardRow>
                <CardRow>
                  <SingleStatCard
                    color={CardColor.Light}
                    title={stringGetter({ key: STRING_KEYS.PENDING })}
                    value={formattedPendingWithdrawBalance}
                    label={stringGetter({ key: STRING_KEYS.IN_REQUESTED_WITHDRAWS })}
                    ctaConfig={
                      userHasStakingBalance
                        ? {
                            color: ButtonColor.Lighter,
                            label: stringGetter({ key: STRING_KEYS.REQUEST }),
                            onClick: () =>
                              openModal({
                                type: ModalType.RequestWithdraw,
                                props: { stakingPool: StakingPool.Safety },
                              }),
                          }
                        : undefined
                    }
                    isLoading={!!walletAddress && !pendingWithdrawBalance}
                  />
                  <SingleStatCard
                    color={CardColor.Light}
                    title={stringGetter({ key: STRING_KEYS.AVAILABLE })}
                    value={formattedAvailableWithdrawBalance}
                    label={stringGetter({ key: STRING_KEYS.READY_TO_WITHDRAW })}
                    ctaConfig={
                      MustBigNumber(availableWithdrawBalance).gt(0)
                        ? {
                            color: ButtonColor.Lighter,
                            label: stringGetter({ key: STRING_KEYS.WITHDRAW }),
                            onClick: handleOnClickWithdrawAvailable,
                            isLoading: isLoadingWithdrawAvailable,
                          }
                        : undefined
                    }
                    isLoading={!!walletAddress && !availableWithdrawBalance}
                  />
                </CardRow>
                <CardRow>
                  <SingleStatCard
                    color={CardColor.Dark}
                    title={stringGetter({ key: STRING_KEYS.BLACKOUT_WINDOW })}
                    value={
                      secondsUntilBlackoutWindow <= FIFTEEN_MINUTES_SECONDS ? (
                        <Styled.RedText>{formattedDiffUntilBlackoutWindow}</Styled.RedText>
                      ) : (
                        formattedDiffUntilBlackoutWindow
                      )
                    }
                    label={stringGetter({
                      key:
                        secondsUntilBlackoutWindow <= 0
                          ? STRING_KEYS.CURRENTLY_IN_BLACKOUT_WINDOW
                          : STRING_KEYS.UNTIL_NEXT_BLACKOUT_WINDOW,
                    })}
                    isLoading={!formattedDiffUntilBlackoutWindow}
                  />
                  <SingleStatCard
                    color={CardColor.Dark}
                    title={stringGetter({ key: STRING_KEYS.NEXT_EPOCH })}
                    value={formattedDiffUntilEpoch}
                    label={stringGetter({ key: STRING_KEYS.UNTIL_NEXT_EPOCH })}
                    isLoading={!formattedDiffUntilEpoch}
                  />
                </CardRow>
              </Styled.WithdrawCardRow>
            </Styled.WithdrawSection>
          )}
        </ContentLeft>
        <Styled.ContentRight>
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.ABOUT })}
            content={
              <>
                {stringGetter({ key: STRING_KEYS.SAFETY_POOL_INACTIVE_ABOUT })}
                <ButtonContainer>
                  <Button
                    linkOutIcon
                    color={ButtonColor.Lighter}
                    href={`${ExternalLink.Documentation}${DocumentationSublinks.SafetyPool}`}
                  >
                    {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
                  </Button>
                </ButtonContainer>
              </>
            }
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.WITHDRAWS })}
            content={stringGetter({ key: STRING_KEYS.SAFETY_POOL_WITHDRAWS })}
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.DISCUSS })}
            content={
              <>
                {stringGetter({ key: STRING_KEYS.POOL_DISCUSS_DESCRIPTION })}
                <ButtonContainer>
                  <Button linkOutIcon color={ButtonColor.Lighter} href={ExternalLink.Forums}>
                    {stringGetter({ key: STRING_KEYS.FORUMS })}
                  </Button>
                  <Button linkOutIcon color={ButtonColor.Light} href={ExternalLink.Discord}>
                    Discord
                  </Button>
                </ButtonContainer>
              </>
            }
          />
        </Styled.ContentRight>
      </DetailPageLayoutContainer>
    </SectionWrapper>
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.BannerContainer = styled.div`
  margin-top: 1.5rem;

  @media ${breakpoints.tablet} {
    margin-top: 0;
    margin-bottom: 1.25rem;
  }
`;

Styled.ContentRight = styled(ContentRight)`
  flex: 0 0 calc(100% - 36rem);
  margin-top: -0.5rem;

  @media ${breakpoints.tablet} {
    margin-top: 1rem;
    flex: 1 1 auto;
  }
`;

Styled.WithdrawSection = styled.div`
  margin-top: 2.5rem;
`;

Styled.WithdrawCardRow = styled.div`
  margin-top: 1.75rem;
`;

Styled.RedText = styled.span`
  color: ${({ theme }) => theme.colorred};
`;

Styled.Spacer = styled.div`
  height: 0.75rem;
  width: 100%;
`;

const mapStateToProps = (state: RootState) => ({
  isUserGeoBlocked: getIsUserGeoBlocked(state),
  stakingBalancesData: getStakingBalancesData(state),
  stakingPoolsData: getStakingPoolsData(state),
  walletAddress: getWalletAddress(state),
  withdrawBalancesData: getWithdrawBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      addNotification: addNotificationAction,
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization<SafetyPoolDetailProps>(
  connect(mapStateToProps, mapDispatchToProps)(SafetyPoolDetail)
);
