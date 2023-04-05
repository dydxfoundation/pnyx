import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DateTime } from 'luxon';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/store';
import { AssetSymbol, DocumentationSublinks, ExternalLink, ModalType, StakingPool } from '@/enums';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { useGetCountdownDiff, usePollEpochData } from '@/hooks';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import GeoBlockBanner from '@/components/GeoBlockBanner';
import SectionHeader from '@/components/SectionHeader';
import SectionWrapper from '@/components/SectionWrapper';

import {
  SingleStatCard,
  InfoCtaCard,
  CardContainer,
  CardSize,
  ValueWithIcon,
} from '@/components/Cards';

import { openModal as openModalAction } from '@/actions/modals';

import { getStakingPoolsData } from '@/selectors/staking-pools';
import { getIsUserGeoBlocked } from '@/selectors/geo';

import { STRING_KEYS } from '@/constants/localization';

import DashboardHeader from './DashboardHeader/DashboardHeader';
import ProposalsSection from './proposals/ProposalsSection';
import StakingPoolsRow from './staking-pools/StakingPoolsRow';

export type DashboardProps = {} & LocalizationProps;

const Dashboard: React.FC<
  DashboardProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> = ({ isUserGeoBlocked, openModal, stakingPoolsData, stringGetter }) => {
  usePollEpochData({ stakingPool: StakingPool.Liquidity });

  const { nextEpochDate } = stakingPoolsData.data[StakingPool.Liquidity];

  const formattedDiffUntilEpoch = useGetCountdownDiff({
    futureDateISO: nextEpochDate,
    stringGetter,
  });

  return (
    <>
      <DashboardHeader />
      {isUserGeoBlocked && <ProposalsSection />}
      {isUserGeoBlocked && (
        <SectionWrapper>
          <GeoBlockBanner />
        </SectionWrapper>
      )}
      <StakingPoolsRow />
      <SectionWrapper column>
        <SectionHeader
          title={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })}
          subtitle={stringGetter({ key: STRING_KEYS.TRADING_REWARDS_DESCRIPTION })}
        />
        <CardContainer>
          <SingleStatCard
            size={CardSize.Large}
            title={stringGetter({ key: STRING_KEYS.COUNTDOWN })}
            isLoading={!formattedDiffUntilEpoch}
            value={formattedDiffUntilEpoch}
            label={
              <SpanWithBaseEmbed
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: stringGetter({
                    key: STRING_KEYS.UNTIL_NEXT_EPOCH_ON_DATE,
                    params: {
                      NEXT_EPOCH_DATE: ReactDOMServer.renderToString(
                        <span>
                          {nextEpochDate
                            ? DateTime.fromISO(nextEpochDate).toFormat('MMMM dd')
                            : '-'}
                        </span>
                      ),
                    },
                  }),
                }}
              />
            }
          />
          <SingleStatCard
            size={CardSize.Large}
            title={stringGetter({ key: STRING_KEYS.REWARD_POOL })}
            value={
              <ValueWithIcon>
                1,582,192
                <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
              </ValueWithIcon>
            }
            label={stringGetter({ key: STRING_KEYS.DISTRIBUTED_THIS_EPOCH })}
          />
          <InfoCtaCard
            label={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })}
            body={stringGetter({ key: STRING_KEYS.TRADING_REWARDS_DESCRIPTION_2 })}
            ctaConfigs={{
              primary: {
                label: stringGetter({ key: STRING_KEYS.TRADE }),
                onClick: () => openModal({ type: ModalType.TradeLink }),
                linkOutIcon: true,
              },
              secondary: {
                label: stringGetter({ key: STRING_KEYS.LEARN_MORE }),
                onClick: () => {
                  window.open(
                    `${ExternalLink.Documentation}${DocumentationSublinks.TradingRewards}`,
                    '_blank'
                  );
                },
                linkOutIcon: true,
              },
            }}
          />
        </CardContainer>
      </SectionWrapper>
      {!isUserGeoBlocked && <ProposalsSection />}
    </>
  );
};

const SpanWithBaseEmbed = styled.span`
  > span {
    color: ${({ theme }) => theme.textbase};
  }
`;

const mapStateToProps = (state: RootState) => ({
  isUserGeoBlocked: getIsUserGeoBlocked(state),
  stakingPoolsData: getStakingPoolsData(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization<DashboardProps>(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
