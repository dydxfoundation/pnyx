import React from 'react';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';
import _ from 'lodash';

import { RootState } from 'store';
import { LocalizationProps } from 'types';

import { withLocalization } from 'hoc';
import { useGetLatestProposals } from 'hooks';

import ProposalRow, { ProposalRowEmptyState } from 'components/ProposalRow';
import SectionHeader from 'components/SectionHeader';
import SectionWrapper from 'components/SectionWrapper';

import { getLatestProposals } from 'selectors/governance';

import { STRING_KEYS } from 'constants/localization';
import LoadingBar from 'components/LoadingBar';

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
          <LoadingBar fullWidth useDarkStyles height={4.625} />
          <LoadingBar fullWidth useDarkStyles height={4.625} />
          <LoadingBar fullWidth useDarkStyles height={4.625} />
        </>
      );
    }

    if (_.isEmpty(latestProposals)) {
      return (
        <ProposalRowEmptyState title={stringGetter({ key: STRING_KEYS.PROPOSALS_EMPTY_STATE })} />
      );
    }

    return _.map(latestProposals, (proposal) => (
      <ProposalRow key={proposal.id} proposal={proposal} />
    ));
  };

  return (
    <SectionWrapper column>
      <SectionHeader
        title={stringGetter({ key: STRING_KEYS.PROPOSALS })}
        subtitle={stringGetter({ key: STRING_KEYS.PROPOSALS_DESCRIPTION })}
      />
      <ProposalContainer>{renderProposals()}</ProposalContainer>
    </SectionWrapper>
  );
};

const ProposalContainer = styled.div`
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
