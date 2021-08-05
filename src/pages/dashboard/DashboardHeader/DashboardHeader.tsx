import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components/macro';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

import { AppDispatch, RootState } from 'store';
import { LocalizationProps } from 'types';
import { AssetSymbol, DecimalPlaces, ModalType } from 'enums';

import {
  useGetCirculatingSupply,
  useGetCountdownDiff,
  usePollGovernancePowersData,
  usePollWalletBalances,
} from 'hooks';

import { withLocalization } from 'hoc';
import { breakpoints, NotTabletOnly, TabletOnly } from 'styles';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import LoadingBar from 'components/LoadingBar';
import SectionWrapper from 'components/SectionWrapper';

import {
  ProgressBarCard,
  SingleStatCard,
  CardContainer,
  CardSize,
  CardColor,
} from 'components/Cards';

import { openModal as openModalAction } from 'actions/modals';

import { getWalletBalancesData } from 'selectors/balances';
import { getIsUserGeoBlocked } from 'selectors/geo';
import { getWalletAddress } from 'selectors/wallets';
import { getGovernancePowersData } from 'selectors/governance';

import { STRING_KEYS } from 'constants/localization';

import { MustBigNumber } from 'lib/numbers';
import { findVotingPowerDelegatee, findProposingPowerDelegatee } from 'lib/governance';

import DashboardHero from './DashboardHero';
import PortfolioModule from './PortfolioModule';

import { ValueWithIcon } from '../DashboardStyles';

export type DashboardHeaderProps = {} & LocalizationProps;

const DashboardHeader: React.FC<
  DashboardHeaderProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> = ({
  governancePowersData,
  isUserGeoBlocked,
  openModal,
  stringGetter,
  walletAddress,
  walletBalancesData,
}) => {
  usePollGovernancePowersData();

  usePollWalletBalances({ assetSymbol: AssetSymbol.DYDX });
  usePollWalletBalances({ assetSymbol: AssetSymbol.stDYDX });

  const formattedDiffUntilTransferLock = useGetCountdownDiff({
    futureDateISO: '2021-09-08T08:00:00-0700',
    stringGetter,
  });

  const circulatingSupply = useGetCirculatingSupply();
  const circulatingSupplyPercent = MustBigNumber(circulatingSupply).div('1000000000');

  const { hasDelegatees: proposingPowerHasDelegatees } = findProposingPowerDelegatee({
    forStakedTokenPowers: true,
    forTokenPowers: true,
    governancePowersData,
    walletAddress,
  });

  const { hasDelegatees: votingPowerHasDelegatees } = findVotingPowerDelegatee({
    forStakedTokenPowers: true,
    forTokenPowers: true,
    governancePowersData,
    walletAddress,
  });

  const { proposalPower, votingPower, delegatees } = governancePowersData;

  const delegationAvailable =
    !MustBigNumber(walletBalancesData[AssetSymbol.DYDX].balance).isZero() ||
    !MustBigNumber(walletBalancesData[AssetSymbol.stDYDX].balance).isZero();

  const showDelegateProposingPower =
    !isUserGeoBlocked &&
    !_.isNil(delegatees) &&
    (delegationAvailable || proposingPowerHasDelegatees);

  const showDelegateVotingPower =
    !isUserGeoBlocked && !_.isNil(delegatees) && (delegationAvailable || votingPowerHasDelegatees);

  return (
    <SectionWrapper>
      <StyledDashboardHeader>
        {walletAddress ? <PortfolioModule /> : <DashboardHero />}
        <Cards>
          <CardContainer alignRight noMarginTop noWrap>
            <ProgressBarCard
              progress={circulatingSupplyPercent.toNumber()}
              progressBarLabels={{
                topLeft: circulatingSupply ? (
                  <ValueWithIcon>
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      value={MustBigNumber(circulatingSupply).toFixed(DecimalPlaces.None)}
                    />
                    <AssetIcon size={AssetIconSize.Tiny} symbol={AssetSymbol.DYDX} />
                  </ValueWithIcon>
                ) : (
                  <LoadingBar height={1.375} width={5} />
                ),
                topRight: '1,000,000,000',
                bottomLeft: circulatingSupply ? (
                  `${circulatingSupplyPercent.times(100).toFixed(DecimalPlaces.Percent)}%`
                ) : (
                  <>
                    <NotTabletOnly>
                      <LoadingBar height={1.125} width={3} />
                    </NotTabletOnly>
                    <TabletOnly>
                      <LoadingBar height={1.25} width={3} />
                    </TabletOnly>
                  </>
                ),
              }}
              size={CardSize.Small}
              title={stringGetter({ key: STRING_KEYS.CIRCULATING_SUPPLY })}
            />
            {/* <SingleStatCard
              size={CardSize.Small}
              title={stringGetter({ key: STRING_KEYS.DISTRIBUTED_TODAY })}
              value={
                <ValueWithIcon>
                  13,698.64
                  <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
            /> */}
            <SingleStatCard
              size={CardSize.Small}
              title={stringGetter({ key: STRING_KEYS.TRANSFER_LOCK_COOLDOWN })}
              isLoading={!formattedDiffUntilTransferLock}
              value={formattedDiffUntilTransferLock}
              label={stringGetter({ key: STRING_KEYS.UNTIL_TRANSFER_LOCK_IS_RELEASED })}
            />
          </CardContainer>
          {walletAddress && (
            <CardContainer alignRight noMarginTop noWrap>
              <SingleStatCard
                color={CardColor.Light}
                size={CardSize.Small}
                title={stringGetter({ key: STRING_KEYS.PROPOSAL_POWER })}
                value={
                  <ValueWithIcon>
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      value={MustBigNumber(0).toFixed(DecimalPlaces.ShortToken)}
                    />
                    <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
                  </ValueWithIcon>
                }
                label={
                  showDelegateProposingPower
                    ? `${stringGetter({
                        key: proposingPowerHasDelegatees
                          ? STRING_KEYS.MANAGE_DELEGATION
                          : STRING_KEYS.DELEGATE,
                      })} →`
                    : undefined
                }
                onClick={
                  showDelegateProposingPower
                    ? () => openModal({ type: ModalType.Delegate })
                    : undefined
                }
                isLoading={_.isNil(proposalPower)}
              />
              <SingleStatCard
                color={CardColor.Light}
                size={CardSize.Small}
                title={stringGetter({ key: STRING_KEYS.VOTING_POWER })}
                value={
                  <ValueWithIcon>
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      value={MustBigNumber(0).toFixed(DecimalPlaces.ShortToken)}
                    />
                    <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
                  </ValueWithIcon>
                }
                label={
                  showDelegateVotingPower
                    ? `${stringGetter({
                        key: votingPowerHasDelegatees
                          ? STRING_KEYS.MANAGE_DELEGATION
                          : STRING_KEYS.DELEGATE,
                      })} →`
                    : undefined
                }
                onClick={
                  showDelegateVotingPower
                    ? () => openModal({ type: ModalType.Delegate })
                    : undefined
                }
                isLoading={_.isNil(votingPower)}
              />
            </CardContainer>
          )}
        </Cards>
      </StyledDashboardHeader>
    </SectionWrapper>
  );
};

const StyledDashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -3rem;
  width: 100%;

  @media ${breakpoints.tablet} {
    flex-direction: column;
  }
`;

const Cards = styled.div`
  min-width: 35.75rem;

  @media ${breakpoints.tablet} {
    min-width: auto;
  }
`;

const mapStateToProps = (state: RootState) => ({
  governancePowersData: getGovernancePowersData(state),
  isUserGeoBlocked: getIsUserGeoBlocked(state),
  walletAddress: getWalletAddress(state),
  walletBalancesData: getWalletBalancesData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization<DashboardHeaderProps>(
  connect(mapStateToProps, mapDispatchToProps)(DashboardHeader)
);
