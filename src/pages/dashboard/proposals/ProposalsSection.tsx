import React from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import { connect } from 'react-redux';
import _ from 'lodash';

import { RootState } from '@/store';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { NotTabletOnly, TabletOnly } from '@/styles';
import { useGetLatestProposals } from '@/hooks';

import ProposalRow, { ProposalRowEmptyState } from '@/components/ProposalRow';
import SectionHeader from '@/components/SectionHeader';
import SectionWrapper from '@/components/SectionWrapper';

import { getLatestProposals } from '@/selectors/governance';

import { STRING_KEYS } from '@/constants/localization';
import LoadingBar from '@/components/LoadingBar';

export type ProposalsSectionProps = {} & LocalizationProps;

type ConnectedProposalsSectionProps = ProposalsSectionProps & ReturnType<typeof mapStateToProps>;

const ProposalsSection: React.FC<ConnectedProposalsSectionProps> = ({
  latestProposals,
  stringGetter,
}) => {
  useGetLatestProposals();

  const renderProposals = () => {
    if (_.isNil(latestProposals)) {
      return (
        <>
          <TabletOnly>
            <Styled.ProposalContainer>
              <LoadingBar fullWidth useDarkStyles height={6.625} />
              <LoadingBar fullWidth useDarkStyles height={6.625} />
              <LoadingBar fullWidth useDarkStyles height={6.625} />
            </Styled.ProposalContainer>
          </TabletOnly>
          <NotTabletOnly>
            <Styled.ProposalContainer>
              <LoadingBar fullWidth useDarkStyles height={4.625} />
              <LoadingBar fullWidth useDarkStyles height={4.625} />
              <LoadingBar fullWidth useDarkStyles height={4.625} />
            </Styled.ProposalContainer>
          </NotTabletOnly>
        </>
      );
    }

    if (_.isEmpty(latestProposals)) {
      return (
        <Styled.ProposalContainer>
          <ProposalRowEmptyState title={stringGetter({ key: STRING_KEYS.PROPOSALS_EMPTY_STATE })} />
        </Styled.ProposalContainer>
      );
    }

    return (
      <Styled.ProposalContainer>
        {_.map(latestProposals, (proposal) => (
          <ProposalRow key={proposal.id} proposal={proposal} />
        ))}
      </Styled.ProposalContainer>
    );
  };

  return (
    <SectionWrapper column>
      <SectionHeader
        title={stringGetter({ key: STRING_KEYS.PROPOSALS })}
        subtitle={stringGetter({ key: STRING_KEYS.PROPOSALS_DESCRIPTION })}
      />
      {renderProposals()}
    </SectionWrapper>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.ProposalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;

  > div {
    margin-top: 1rem;
    border-radius: 1rem;
  }
`;

const mapStateToProps = (state: RootState) => ({
  latestProposals: getLatestProposals(state),
});

export default withLocalization<ProposalsSectionProps>(connect(mapStateToProps)(ProposalsSection));
