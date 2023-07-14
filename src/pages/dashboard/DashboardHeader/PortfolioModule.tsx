import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';

import { RootState } from '@/store';
import { LocalizationProps } from '@/types';
import { AssetSymbol, DecimalPlaces, StakingPool, WalletType } from '@/enums';

import { breakpoints, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';
import { usePollWalletBalances, usePollWithdrawBalances } from '@/hooks';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import LoadingBar from '@/components/LoadingBar';
import WalletIcon from '@/components/WalletIcon';

import { getWalletType } from '@/selectors/wallets';
import { getIsUserGeoBlocked } from '@/selectors/geo';

import {
  getStakingBalancesData,
  getWalletBalancesData,
  getWithdrawBalancesData,
} from '@/selectors/balances';

import { STRING_KEYS } from '@/constants/localization';
import { MustBigNumber } from '@/lib/numbers';

import RewardsModule from './RewardsModule';

export type PortfolioModuleProps = {} & LocalizationProps;

export type ConnectedPortfolioModule = PortfolioModuleProps & ReturnType<typeof mapStateToProps>;

const defaultLoadingBar = <LoadingBar height={2} width={5} />;

const PortfolioModule: React.FC<ConnectedPortfolioModule> = ({
  isUserGeoBlocked,
  stringGetter,
  walletBalancesData,
  walletType,
  withdrawBalancesData,
}) => {
  usePollWalletBalances({ assetSymbol: AssetSymbol.DYDX });
  usePollWalletBalances({ assetSymbol: AssetSymbol.stDYDX });
  usePollWithdrawBalances({ stakingPool: StakingPool.Safety });

  const dydxBalanceData = walletBalancesData[AssetSymbol.DYDX];
  const stDydxBalanceData = walletBalancesData[AssetSymbol.stDYDX];

  const totalWithdrawAvailable = withdrawBalancesData[StakingPool.Safety]?.availableWithdrawBalance;

  return (
    <>
      <StyledPortfolioModule>
        <Top>
          <Title>
            {stringGetter({ key: STRING_KEYS.PORTFOLIO })}
            <Subtitle>{stringGetter({ key: STRING_KEYS.TRACK_BALANCES })}</Subtitle>
          </Title>
          {!isUserGeoBlocked && (
            <NotMobileOnly>
              <RewardsModule isMobile={false} />
            </NotMobileOnly>
          )}
        </Top>
        <Modules>
          <Module>
            <Label>
              <StyledWalletIcon>
                <WalletIcon walletType={walletType as WalletType} />
              </StyledWalletIcon>
              {stringGetter({ key: STRING_KEYS.WALLET })}
            </Label>
            <Value>
              {dydxBalanceData.balance ? (
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(dydxBalanceData.balance).toFixed(DecimalPlaces.ShortToken)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              ) : (
                defaultLoadingBar
              )}
            </Value>
          </Module>
          <Module>
            <Label>{stringGetter({ key: STRING_KEYS.STAKED })}</Label>
            <Value>
              {stDydxBalanceData.balance ? (
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(stDydxBalanceData.balance).toFixed(
                      DecimalPlaces.ShortToken
                    )}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              ) : (
                defaultLoadingBar
              )}
            </Value>
          </Module>
          <Module>
            <Label>{stringGetter({ key: STRING_KEYS.WITHDRAWABLE })}</Label>
            <Value>
              {totalWithdrawAvailable ? (
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(totalWithdrawAvailable).toFixed(DecimalPlaces.ShortToken)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              ) : (
                defaultLoadingBar
              )}
            </Value>
          </Module>
        </Modules>
      </StyledPortfolioModule>
      {!isUserGeoBlocked && (
        <MobileOnlyModule>
          <RewardsModule isMobile />
        </MobileOnlyModule>
      )}
    </>
  );
};

const StyledPortfolioModule = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.layerdark};
  width: 100%;
  margin-right: 1.25rem;
  margin-top: 1.25rem;
  border-radius: 0.75rem;
  padding: 1.5rem 2rem;
  background-image: url('/dots-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 16rem;

  @media ${breakpoints.tablet} {
    background-size: 60% auto;
    padding: 1.5rem;
    margin: 0;
  }

  @media ${breakpoints.mobile} {
    background-size: cover;
    min-height: auto;
  }
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  ${fontSizes.size20};
  color: ${({ theme }) => theme.textlight};
  margin-right: 1.5rem;
  margin-bottom: 1rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size22};
  }
`;

const Subtitle = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.125rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

const Modules = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -1rem;
`;

const Module = styled.div`
  margin-bottom: 1rem;
  flex: 1 1 8rem;

  &:not(:last-child) {
    padding-right: 1.5rem;
  }
`;

const Label = styled.div`
  ${fontSizes.size14}
  display: flex;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

const StyledWalletIcon = styled.div`
  > svg,
  > img {
    margin-right: 0.5rem;
    height: 1rem;
    width: 1rem;
  }
`;

const Value = styled.div`
  ${fontSizes.size24}
  color: ${({ theme }) => theme.textlight};
  margin-top: 0.125rem;

  @media ${breakpoints.tablet} {
    margin-top: 0.25rem;
  }
`;

const ValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-top: 0.125rem;
    margin-left: 0.375rem;
  }
`;

const MobileOnlyModule = styled.div`
  display: none;
  margin-top: 1.25rem;
  width: 100%;

  @media ${breakpoints.mobile} {
    display: block;
  }
`;

const NotMobileOnly = styled.div`
  @media ${breakpoints.mobile} {
    visibility: hidden;
    height: 0;
  }
`;

const mapStateToProps = (state: RootState) => ({
  isUserGeoBlocked: getIsUserGeoBlocked(state),
  stakingBalancesData: getStakingBalancesData(state),
  walletBalancesData: getWalletBalancesData(state),
  walletType: getWalletType(state),
  withdrawBalancesData: getWithdrawBalancesData(state),
});

export default withLocalization<PortfolioModuleProps>(connect(mapStateToProps)(PortfolioModule));
