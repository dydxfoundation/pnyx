import React from 'react';
import styled from 'styled-components/macro';

import { LocalizationProps } from 'types';

import { withLocalization } from 'hoc';

import SectionHeader from 'components/SectionHeader';
import SectionWrapper from 'components/SectionWrapper';

import { STRING_KEYS } from 'constants/localization';

import HistoryClaimRewardsModule from './HistoryClaimRewardsModule';
import TradingRewardsHistoryTable from './TradingRewardsHistoryTable';

export type HistoryProps = {} & LocalizationProps;

const History: React.FC<HistoryProps> = ({ stringGetter }) => (
  <StyledHistory>
    <SectionWrapper>
      <HistoryClaimRewardsModule />
    </SectionWrapper>
    <SectionWrapper column>
      <SectionHeader noPadding title={stringGetter({ key: STRING_KEYS.TRADING_REWARDS })} />
      <TradingRewardsHistoryTable />
    </SectionWrapper>
  </StyledHistory>
);

const StyledHistory = styled.div``;

export default withLocalization(History);
