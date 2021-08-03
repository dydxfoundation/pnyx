import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NumberFormat from 'react-number-format';
import styled from 'styled-components/macro';

import { AppDispatch, RootState } from 'store';
import { AssetSymbol, DecimalPlaces, ModalType, StakingPool } from 'enums';
import { LocalizationProps } from 'types';

import { usePollStakingBalances, usePollStakingPoolsData } from 'hooks';
import { withLocalization } from 'hoc';
import { breakpoints } from 'styles';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import Button, { ButtonColor, ButtonContainer } from 'components/Button';
import GeoBlockBanner from 'components/GeoBlockBanner';
import { SingleStatCard, CardColor } from 'components/Cards';

import CollapsibleSection from 'components/CollapsibleSection';
import DetailPageHeader from 'components/DetailPageHeader';
import SectionWrapper from 'components/SectionWrapper';

import { openModal as openModalAction } from 'actions/modals';

import { getStakingBalancesData } from 'selectors/balances';
import { getStakingPoolsData } from 'selectors/staking-pools';
import { getWalletAddress } from 'selectors/wallets';
import { getIsUserGeoBlocked } from 'selectors/geo';

import { STRING_KEYS } from 'constants/localization';
import { MustBigNumber } from 'lib/numbers';

import { DetailPageLayoutContainer, ContentLeft, ContentRight, CardRow } from '../DetailPageStyles';

type SafetyPoolDetailProps = {} & LocalizationProps;

const SafetyPoolDetail: React.FC<
  SafetyPoolDetailProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> = ({
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

  const safetyPoolStakingBalances = balances[StakingPool.Safety];
  const safetyPoolData = stakingPoolsData.data[StakingPool.Safety];

  const userHasStakingBalance = walletAddress && safetyPoolStakingBalances.userBalance;

  let userBalance: React.ReactNode = '-';

  if (walletAddress) {
    if (safetyPoolStakingBalances.userBalance) {
      userBalance = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(safetyPoolStakingBalances.userBalance).toFixed(
              DecimalPlaces.ShortToken
            )}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }
  }

  let earnings: React.ReactNode = '-';

  if (walletAddress) {
    if (safetyPoolStakingBalances.unclaimedRewards) {
      earnings = (
        <ValueWithIcon>
          <NumberFormat
            thousandSeparator
            displayType="text"
            value={MustBigNumber(safetyPoolStakingBalances.unclaimedRewards).toFixed(
              DecimalPlaces.Token
            )}
          />
          <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
        </ValueWithIcon>
      );
    }
  }

  return (
    <SectionWrapper column>
      <DetailPageHeader
        ctaConfig={{
          label: stringGetter({ key: STRING_KEYS.STAKE }),
          onClick: () =>
            openModal({ type: ModalType.Stake, props: { stakingPool: StakingPool.Safety } }),
          disabled: true,
        }}
        label={stringGetter({ key: STRING_KEYS.POOL })}
        title={stringGetter({ key: STRING_KEYS.SAFETY_POOL })}
        subtitle={stringGetter({ key: STRING_KEYS.SAFETY_POOL_DESCRIPTION })}
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
                    value={MustBigNumber(safetyPoolData.poolSize).toFixed(DecimalPlaces.None)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.CURRENTLY_BEING_STAKED })}
              isLoading={!safetyPoolData.poolSize}
            />
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.CURRENT_APR })}
              value="0.00%"
              label={stringGetter({ key: STRING_KEYS.ESTIMATED_RATE })}
            />
          </CardRow>
          <CardRow>
            <SingleStatCard
              color={walletAddress ? CardColor.Light : CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.STAKED })}
              value={userBalance}
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
              // ctaConfig={{
              //   color: ButtonColor.Lighter,
              //   disabled: !walletAddress,
              //   label: stringGetter({ key: STRING_KEYS.WITHDRAW }),
              //   onClick: () => openModal({ type: ModalType.Claim }),
              // }}
              isLoading={!!walletAddress && !safetyPoolStakingBalances.userBalance}
            />
            <SingleStatCard
              color={walletAddress ? CardColor.Light : CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.EARNED })}
              value={earnings}
              label={stringGetter({
                key: userHasStakingBalance
                  ? STRING_KEYS.UNCLAIMED_REWARDS
                  : STRING_KEYS.STAKE_TO_EARN_REWARDS,
              })}
              ctaConfig={{
                disabled: true,
                label: stringGetter({ key: STRING_KEYS.CLAIM }),
                onClick: () => openModal({ type: ModalType.Claim }),
              }}
              isLoading={!!walletAddress && !safetyPoolStakingBalances.unclaimedRewards}
            />
          </CardRow>
        </ContentLeft>
        <ContentRight>
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.ABOUT })}
            content={stringGetter({ key: STRING_KEYS.SAFETY_POOL_ABOUT })}
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.RISKS })}
            content={stringGetter({ key: STRING_KEYS.SAFETY_POOL_RISKS })}
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.REWARDS })}
            content={stringGetter({ key: STRING_KEYS.SAFETY_POOL_REWARDS })}
          />
          <CollapsibleSection
            label={stringGetter({ key: STRING_KEYS.DISCUSS })}
            content={
              <>
                {stringGetter({ key: STRING_KEYS.POOL_DISCUSS_DESCRIPTION })}
                <ButtonContainer>
                  <Button color={ButtonColor.Lighter} linkOutIcon onClick={() => {}}>
                    {stringGetter({ key: STRING_KEYS.FORUMS })}
                  </Button>
                  <Button color={ButtonColor.Light} linkOutIcon onClick={() => {}}>
                    Discord
                  </Button>
                </ButtonContainer>
              </>
            }
          />
        </ContentRight>
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

const ValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-top: 0.125rem;
    margin-left: 0.375rem;
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

export default withLocalization<SafetyPoolDetailProps>(
  connect(mapStateToProps, mapDispatchToProps)(SafetyPoolDetail)
);
