import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/store';
import { AppRoute, DocumentationSublinks, ExternalLink, StakingPool } from '@/enums';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { usePollEpochData } from '@/hooks';

import GeoBlockBanner from '@/components/GeoBlockBanner';
import SectionHeader from '@/components/SectionHeader';
import SectionWrapper from '@/components/SectionWrapper';

import { InfoCtaCard, CardContainer } from '@/components/Cards';

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
> = ({ isUserGeoBlocked, stringGetter }) => {
  usePollEpochData({ stakingPool: StakingPool.Liquidity });

  const renderLink = (text: string, href: string) =>
    ReactDOMServer.renderToString(
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );

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
        <SectionHeader title={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })} />
        <StyledCardContainer>
          <InfoCtaCard
            label={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })}
            body={
              <StyledRewardsContent>
                <p
                  dangerouslySetInnerHTML={{
                    __html: stringGetter({
                      key: STRING_KEYS.TRADING_REWARDS_UPDATED_DESCRIPTION_1,
                      params: {
                        DIP_29_LINK: renderLink('DIP 29', `${AppRoute.ProposalDetail}/16`),
                      },
                    }),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: stringGetter({
                      key: STRING_KEYS.TRADING_REWARDS_UPDATED_DESCRIPTION_2,
                      params: {
                        TRADING_REWARDS_FORMULA_LINK: renderLink(
                          stringGetter({ key: STRING_KEYS.TRADING_REWARDS_FORMULA }),
                          `${ExternalLink.Documentation}${DocumentationSublinks.TradingRewards}`
                        ),
                      },
                    }),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: stringGetter({
                      key: STRING_KEYS.TRADING_REWARDS_UPDATED_DESCRIPTION_3,
                      params: {
                        DYDX_FOUNDATION_LINK: renderLink(
                          'dYdX Foundation',
                          ExternalLink.Foundation
                        ),
                      },
                    }),
                  }}
                />
              </StyledRewardsContent>
            }
            ctaConfigs={{
              primary: {
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
        </StyledCardContainer>
      </SectionWrapper>
      {!isUserGeoBlocked && <ProposalsSection />}
    </>
  );
};

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

const StyledCardContainer = styled(CardContainer)`
  > div {
    flex: 1;
    width: 100%;
  }
`;

const StyledRewardsContent = styled.div`
  a {
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
