import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
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
import { MustBigNumber } from '@/lib/numbers';

import {
  calculateEstimatedLiquidityPoolYieldPerDay,
  calculateUserStakingBalance,
} from '@/lib/staking-pools';

import { DetailPageLayoutContainer, ContentLeft, ContentRight, CardRow } from '../DetailPageStyles';

const FIFTEEN_MINUTES_SECONDS = 15 * 60;

type LiquidityPoolDetailProps = {} & LocalizationProps;

const LiquidityPoolDetail: React.FC<
  LiquidityPoolDetailProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
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

  usePollEpochData({ stakingPool: StakingPool.Liquidity });
  usePollWithdrawBalances({ stakingPool: StakingPool.Liquidity });

  const { userBalance, unclaimedRewards } = stakingBalancesData.balances[StakingPool.Liquidity];

  const { nextEpochDate, lengthOfBlackoutWindow, poolSize, rewardsPerSecond } =
    stakingPoolsData.data[StakingPool.Liquidity];

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

  const { availableWithdrawBalance, pendingWithdrawBalance } =
    withdrawBalancesData[StakingPool.Liquidity];

  const userStakingBalance = calculateUserStakingBalance({
    stakingBalancesData,
    stakingPool: StakingPool.Liquidity,
    withdrawBalancesData,
  });

  const userHasStakingBalance = walletAddress && userStakingBalance?.gt(0);

  const handleOnClickWithdrawAvailable = async () => {
    try {
      setIsLoadingWithdrawAvailable(true);

      const txHash = await contractClient.stakingPoolClient.withdrawAvailableBalance({
        amount: availableWithdrawBalance,
        stakingPool: StakingPool.Liquidity,
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

  if (walletAddress && userStakingBalance) {
    formattedUserBalance = (
      <ValueWithIcon>
        <NumberFormat
          thousandSeparator
          displayType="text"
          value={userStakingBalance.toFixed(DecimalPlaces.ShortToken)}
        />
        <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
      </ValueWithIcon>
    );
  }

  let formattedEarnings: React.ReactNode = '-';

  if (walletAddress) {
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
  }

  let formattedAvailableWithdrawBalance: React.ReactNode = '-';

  if (walletAddress) {
    if (availableWithdrawBalance) {
      formattedAvailableWithdrawBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(availableWithdrawBalance).toFixed(DecimalPlaces.ShortToken)}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
        </ValueWithIcon>
      );
    }
  }

  let formattedPendingWithdrawBalance: React.ReactNode = '-';

  if (walletAddress) {
    if (pendingWithdrawBalance) {
      formattedPendingWithdrawBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(pendingWithdrawBalance).toFixed(DecimalPlaces.ShortToken)}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
        </ValueWithIcon>
      );
    }
  }

  return (
    <SectionWrapper column>
      <DetailPageHeader
        label={stringGetter({ key: STRING_KEYS.POOL })}
        title={stringGetter({ key: STRING_KEYS.LIQUIDITY_POOL })}
        subtitle={stringGetter({ key: STRING_KEYS.LIQUIDITY_POOL_DESCRIPTION })}
      />
      {isUserGeoBlocked && (
        <BannerContainer>
          <GeoBlockBanner />
        </BannerContainer>
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
                    value={MustBigNumber(poolSize).toFixed(DecimalPlaces.None)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.CURRENTLY_BEING_STAKED })}
              isLoading={!poolSize}
            />
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.YIELD_PER_THOUSAND })}
              value={
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={calculateEstimatedLiquidityPoolYieldPerDay({
                      poolSize,
                      rewardsPerSecond,
                    }).toFixed(DecimalPlaces.ShortToken)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.ESTIMATED_YIELD_PER_DAY })}
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
                      params: { SYMBOL: AssetSymbol.USDC },
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
            <WithdrawSection>
              <SectionHeader
                title={stringGetter({ key: STRING_KEYS.WITHDRAWS })}
                subtitle={stringGetter({ key: STRING_KEYS.WITHDRAWS_DESCRIPTION })}
              />
              <WithdrawCardRow>
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
                                props: { stakingPool: StakingPool.Liquidity },
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
                        <RedText>{formattedDiffUntilBlackoutWindow}</RedText>
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
              </WithdrawCardRow>
            </WithdrawSection>
          )}
        </ContentLeft>
        <StyledContentRight>
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.ABOUT })}
            content={
              <>
                <About
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: stringGetter({
                      key: STRING_KEYS.LIQUIDITY_POOL_ABOUT,
                      params: {
                        DIP_14_LINK: ReactDOMServer.renderToString(
                          <a
                            href="https://dydx.community/dashboard/proposal/7"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            DIP 14
                          </a>
                        ),
                      },
                    }),
                  }}
                />

                <ButtonContainer>
                  <Button
                    linkOutIcon
                    color={ButtonColor.Lighter}
                    href={`${ExternalLink.Documentation}${DocumentationSublinks.LiquidityPool}`}
                  >
                    {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
                  </Button>
                </ButtonContainer>
              </>
            }
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.WITHDRAWS })}
            content={stringGetter({ key: STRING_KEYS.LIQUIDITY_POOL_REWARDS })}
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
        </StyledContentRight>
      </DetailPageLayoutContainer>
    </SectionWrapper>
  );
};

const BannerContainer = styled.div`
  margin-top: 1.5rem;

  @media ${breakpoints.tablet} {
    margin-top: 0;
    margin-bottom: 1.25rem;
  }
`;

const StyledContentRight = styled(ContentRight)`
  flex: 0 0 calc(100% - 36rem);
  margin-top: -0.5rem;

  @media ${breakpoints.tablet} {
    margin-top: 1rem;
    flex: 1 1 auto;
  }
`;

const About = styled.span`
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

const WithdrawSection = styled.div`
  margin-top: 2.5rem;
`;

const WithdrawCardRow = styled.div`
  margin-top: 1.75rem;
`;

const RedText = styled.span`
  color: ${({ theme }) => theme.colorred};
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

export default withLocalization<LiquidityPoolDetailProps>(
  connect(mapStateToProps, mapDispatchToProps)(LiquidityPoolDetail)
);
