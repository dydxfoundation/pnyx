import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import styled from 'styled-components/macro';

import { AppDispatch, RootState } from 'store';
import { LocalizationProps } from 'types';

import {
  AssetSymbol,
  DecimalPlaces,
  ExternalLink,
  ModalType,
  StakingPool,
  StakingPoolRoute,
} from 'enums';

import { withLocalization } from 'hoc';
import { breakpoints, fontSizes, NotMobileOnly } from 'styles';
import { usePollStakingBalances, usePollStakingPoolsData } from 'hooks';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import LoadingBar from 'components/LoadingBar';
import SectionHeader from 'components/SectionHeader';
import SectionWrapper from 'components/SectionWrapper';

import { InfoModuleCard, InfoCtaCard, CardContainer, WithDetailFooter } from 'components/Cards';

import { openModal as openModalAction } from 'actions/modals';

import { getStakingBalancesData } from 'selectors/balances';
import { getIsUserGeoBlocked } from 'selectors/geo';
import { getStakingPoolsData } from 'selectors/staking-pools';
import { getWalletAddress } from 'selectors/wallets';

import { STRING_KEYS } from 'constants/localization';
import { abbreviateNumber, MustBigNumber } from 'lib/numbers';
import { calculateEstimatedLiquidityPoolYieldPerDay } from 'lib/staking-pools';

const defaultLoadingBar = <LoadingBar height={1.625} width={4} />;

export type StakingPoolsRowProps = {} & LocalizationProps;

const StakingPoolsRow: React.FC<
  StakingPoolsRowProps &
    RouteComponentProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({
  history,
  isUserGeoBlocked,
  openModal,
  stakingBalancesData,
  stakingPoolsData,
  stringGetter,
  walletAddress,
}) => {
  usePollStakingPoolsData();
  usePollStakingBalances();

  const { balances } = stakingBalancesData;

  // const safetyPoolStakingBalances = balances[StakingPool.Safety];
  // const safetyPoolData = stakingPoolsData.data[StakingPool.Safety];

  // let safetyPoolSize: React.ReactNode;

  // if (safetyPoolData.poolSize) {
  //   const { num, suffix } = abbreviateNumber({
  //     num: MustBigNumber(safetyPoolData.poolSize).toString(),
  //     decimals: DecimalPlaces.None,
  //   });

  //   safetyPoolSize = (
  //     <ValueWithIcon>
  //       <NumberFormat thousandSeparator displayType="text" value={num} suffix={suffix} />
  //       <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
  //     </ValueWithIcon>
  //   );
  // } else {
  //   safetyPoolSize = defaultLoadingBar;
  // }

  // let safetyPoolUserBalance: React.ReactNode = '-';

  // if (walletAddress) {
  //   if (safetyPoolStakingBalances.userBalance) {
  //     const { num, suffix } = abbreviateNumber({
  //       num: MustBigNumber(safetyPoolStakingBalances.userBalance).toString(),
  //       decimals: DecimalPlaces.Abbreviated,
  //     });

  //     safetyPoolUserBalance = (
  //       <ValueWithIcon>
  //         <NumberFormat thousandSeparator displayType="text" value={num} suffix={suffix} />
  //         <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
  //       </ValueWithIcon>
  //     );
  //   } else {
  //     safetyPoolUserBalance = defaultLoadingBar;
  //   }
  // }

  const safetyPoolCard = (
    <InfoModuleCard
      isDisabled
      title={
        <ComingSoonTitle>
          {stringGetter({ key: STRING_KEYS.SAFETY_POOL })}
          <ComingSoon>{stringGetter({ key: STRING_KEYS.COMING_SOON })}</ComingSoon>
        </ComingSoonTitle>
      }
      symbol={AssetSymbol.DYDX}
      // onClick={() => history.push(StakingPoolRoute.SafetyPool)}
      infoModulesConfig={[
        {
          label: stringGetter({ key: STRING_KEYS.POOL_SIZE }),
          value: '0',
        },
        { label: stringGetter({ key: STRING_KEYS.CURRENT_APR }), value: '0.00%' },
        {
          label: stringGetter({ key: STRING_KEYS.YOUR_STAKE }),
          value: '0',
        },
      ]}
    />
  );

  const liquidityPoolStakingBalances = balances[StakingPool.Liquidity];

  const {
    poolSize: liquidityPoolSize,
    rewardsPerSecond: liquidityRewardsPerSecond,
  } = stakingPoolsData.data[StakingPool.Liquidity];

  let liquidityPoolUserBalance: React.ReactNode = '-';

  if (walletAddress) {
    if (liquidityPoolStakingBalances.userBalance) {
      const { num, suffix } = abbreviateNumber({
        num: MustBigNumber(liquidityPoolStakingBalances.userBalance).toString(),
        decimals: DecimalPlaces.Abbreviated,
      });

      liquidityPoolUserBalance = (
        <ValueWithIcon>
          <NumberFormat thousandSeparator displayType="text" value={num} suffix={suffix} />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
        </ValueWithIcon>
      );
    } else {
      liquidityPoolUserBalance = defaultLoadingBar;
    }
  }

  let formattedLiquidityPoolSize: React.ReactNode;

  if (liquidityPoolSize) {
    const { num, suffix } = abbreviateNumber({
      num: MustBigNumber(liquidityPoolSize).toString(),
      decimals: DecimalPlaces.None,
    });

    formattedLiquidityPoolSize = (
      <ValueWithIcon>
        <NumberFormat thousandSeparator displayType="text" value={num} suffix={suffix} />
        <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.USDC} />
      </ValueWithIcon>
    );
  } else {
    formattedLiquidityPoolSize = defaultLoadingBar;
  }

  let liquidityPoolYieldPerThousand: React.ReactNode;

  if (liquidityPoolSize && liquidityRewardsPerSecond) {
    liquidityPoolYieldPerThousand = (
      <ValueWithIcon>
        <NumberFormat
          thousandSeparator
          displayType="text"
          value={calculateEstimatedLiquidityPoolYieldPerDay({
            poolSize: liquidityPoolSize,
            rewardsPerSecond: liquidityRewardsPerSecond,
          }).toFixed(DecimalPlaces.ShortToken)}
        />
        <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
      </ValueWithIcon>
    );
  } else {
    liquidityPoolYieldPerThousand = defaultLoadingBar;
  }

  const liquidityPoolCard = (
    <InfoModuleCard
      title={stringGetter({ key: STRING_KEYS.LIQUIDITY_POOL })}
      symbol={AssetSymbol.USDC}
      onClick={() => history.push(StakingPoolRoute.LiquidityPool)}
      infoModulesConfig={[
        {
          label: stringGetter({ key: STRING_KEYS.POOL_SIZE }),
          value: formattedLiquidityPoolSize,
        },
        {
          label: stringGetter({ key: STRING_KEYS.YIELD_PER_THOUSAND_PER_DAY }),
          value: liquidityPoolYieldPerThousand,
        },
        { label: stringGetter({ key: STRING_KEYS.YOUR_STAKE }), value: liquidityPoolUserBalance },
      ]}
    />
  );

  // let safetyPoolEarnings: React.ReactNode;
  // if (walletAddress) {
  //   if (safetyPoolStakingBalances.unclaimedRewards) {
  //     safetyPoolEarnings = (
  //       <ValueWithIcon>
  //         <NumberFormat
  //           thousandSeparator
  //           displayType="text"
  //           value={MustBigNumber(safetyPoolStakingBalances.unclaimedRewards).toFixed(
  //             DecimalPlaces.ShortToken,
  //             BigNumber.ROUND_UP
  //           )}
  //         />
  //         <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
  //       </ValueWithIcon>
  //     );
  //   } else {
  //     safetyPoolEarnings = defaultLoadingBar;
  //   }
  // }

  let liquidityPoolEarnings: React.ReactNode;
  if (walletAddress) {
    if (liquidityPoolStakingBalances.unclaimedRewards) {
      liquidityPoolEarnings = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(liquidityPoolStakingBalances.unclaimedRewards).toFixed(
              DecimalPlaces.ShortToken,
              BigNumber.ROUND_UP
            )}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    } else {
      liquidityPoolEarnings = defaultLoadingBar;
    }
  }

  return (
    <SectionWrapper column>
      <SectionHeader
        title={stringGetter({ key: STRING_KEYS.STAKING })}
        subtitle={stringGetter({ key: STRING_KEYS.STAKING_DESCRIPTION })}
      />
      <CardContainer>
        {!isUserGeoBlocked && walletAddress ? (
          <WithDetailFooter
            label={stringGetter({ key: STRING_KEYS.YOUR_REWARDS })}
            value={liquidityPoolEarnings}
            ctaConfigs={{
              primary: {
                label: stringGetter({ key: STRING_KEYS.STAKE }),
                onClick: () =>
                  openModal({
                    type: ModalType.Stake,
                    props: { stakingPool: StakingPool.Liquidity },
                  }),
              },
            }}
          >
            {liquidityPoolCard}
          </WithDetailFooter>
        ) : (
          liquidityPoolCard
        )}
        {!isUserGeoBlocked && walletAddress ? (
          <WithDetailFooter
            isDisabled
            label={stringGetter({ key: STRING_KEYS.YOUR_REWARDS })}
            value="0.00"
            ctaConfigs={{
              primary: {
                label: stringGetter({ key: STRING_KEYS.STAKE }),
                onClick: () =>
                  openModal({
                    type: ModalType.Stake,
                    props: { stakingPool: StakingPool.Safety },
                  }),
              },
            }}
          >
            {safetyPoolCard}
          </WithDetailFooter>
        ) : (
          safetyPoolCard
        )}
        <NotMobileOnly>
          <InfoCtaCard
            label={stringGetter({ key: STRING_KEYS.PROPOSE_IDEA })}
            title={stringGetter({ key: STRING_KEYS.SUGGEST_NEW_POOL })}
            ctaConfigs={{
              primary: {
                label: stringGetter({ key: STRING_KEYS.FORUMS }),
                onClick: () => {
                  window.open(ExternalLink.Forums, '_blank');
                },
                linkOutIcon: true,
              },
              secondary: {
                label: 'Discord',
                onClick: () => window.open(ExternalLink.Discord, '_blank'),
                linkOutIcon: true,
              },
            }}
          />
        </NotMobileOnly>
      </CardContainer>
    </SectionWrapper>
  );
};

const ValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-top: 0.125rem;
    margin-left: 0.375rem;
  }
`;

const ComingSoonTitle = styled.div`
  display: flex;
  align-items: center;
`;

const ComingSoon = styled.div`
  ${fontSizes.size13}
  letter-spacing: 0.0625rem;
  text-transform: uppercase;
  opacity: 0.8;
  margin-top: 3px;
  margin-left: 12px;

  @include ${breakpoints.tablet} {
    ${fontSizes.size14}
  }
`;

const mapStateToProps = (state: RootState) => ({
  isUserGeoBlocked: getIsUserGeoBlocked(state),
  stakingBalancesData: getStakingBalancesData(state),
  stakingPoolsData: getStakingPoolsData(state),
  walletAddress: getWalletAddress(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization<StakingPoolsRowProps>(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(StakingPoolsRow))
);
