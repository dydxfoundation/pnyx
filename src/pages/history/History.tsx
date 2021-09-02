import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { LocalizationProps } from 'types';

import { withLocalization } from 'hoc';
import { breakpoints } from 'styles';

import GeoBlockBanner from 'components/GeoBlockBanner';
import SectionHeader from 'components/SectionHeader';
import SectionWrapper from 'components/SectionWrapper';

import { getIsUserGeoBlocked } from 'selectors/geo';

import { STRING_KEYS } from 'constants/localization';

import HistoryClaimRewardsModule from './HistoryClaimRewardsModule';
import TradingRewardsHistoryTable from './TradingRewardsHistoryTable';

export type HistoryProps = {} & LocalizationProps;

const History: React.FC<HistoryProps> = ({ stringGetter }) => {
  const isUserGeoBlocked = useSelector(getIsUserGeoBlocked);

  return (
    <Styled.History>
      {isUserGeoBlocked && (
        <SectionWrapper>
          <GeoBlockBanner />
        </SectionWrapper>
      )}
      <SectionWrapper>
        <HistoryClaimRewardsModule />
      </SectionWrapper>
      <SectionWrapper column>
        <SectionHeader noPadding title={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })} />
        <TradingRewardsHistoryTable />
      </SectionWrapper>
    </Styled.History>
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.History = styled.div`
  margin-top: -1.75rem;

  @media ${breakpoints.tablet} {
    margin-top: -3rem;
  }
`;

export default withLocalization(History);
