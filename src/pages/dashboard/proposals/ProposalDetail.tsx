import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components/macro';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

// @ts-ignore-next-line
import { Proposals } from '@dydxprotocol/governance';

import { AppDispatch, RootState } from 'store';
import {
  AppRoute,
  AssetSymbol,
  DecimalPlaces,
  ExternalLink,
  ModalType,
  ProposalStatus,
} from 'enums';
import { LocalizationProps } from 'types';

import { breakpoints, fontSizes } from 'styles';
import { withLocalization } from 'hoc';
import { CheckMarkIcon, XIcon } from 'icons';

import {
  useGetLatestProposals,
  useGetVotedOnDataForProposal,
  usePollGovernancePowersData,
} from 'hooks';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import Button, { ButtonColor, ButtonContainer } from 'components/Button';
import VoteMeter from 'components/VoteMeter';
import { SingleStatCard, CardColor } from 'components/Cards';

import CollapsibleSection from 'components/CollapsibleSection';
import DetailPageHeader from 'components/DetailPageHeader';
import LoadingSpace from 'components/LoadingSpace';
import SectionWrapper from 'components/SectionWrapper';

import { openModal as openModalAction } from 'actions/modals';

import { getWalletAddress } from 'selectors/wallets';
import { getGovernancePowersData, getLatestProposals } from 'selectors/governance';

import { STRING_KEYS } from 'constants/localization';

import { MustBigNumber } from 'lib/numbers';
import { getStatusLabelKey, getTotalRequiredVotes } from 'lib/proposals';

import { DetailPageLayoutContainer, ContentLeft, ContentRight, CardRow } from '../DetailPageStyles';

export type ProposalDetailProps = {} & LocalizationProps;

const ProposalDetail: React.FC<
  ProposalDetailProps &
    RouteComponentProps<{ proposalId?: string }> &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({
  governancePowersData,
  history,
  latestProposals,
  match,
  openModal,
  stringGetter,
  walletAddress,
}) => {
  const [currentProposal, setCurrentPropsal] = useState<Proposals | undefined>(undefined);

  const {
    params: { proposalId: proposalIdString },
  } = match;

  const proposalId = Number(proposalIdString);

  useGetLatestProposals();
  usePollGovernancePowersData();

  const votedOnData = useGetVotedOnDataForProposal({ proposalId });

  useEffect(() => {
    if (!proposalIdString) {
      history.replace(AppRoute.Dashboard);
    }

    if (!_.isNil(latestProposals)) {
      const proposal = _.find(
        latestProposals,
        (proposalEntry) => Number(proposalEntry.id) === proposalId
      );

      if (proposal) {
        setCurrentPropsal(proposal);
      } else {
        history.replace(AppRoute.Dashboard);
      }
    }
  }, [history, latestProposals, proposalId, proposalIdString]);

  if (!currentProposal) {
    return <LoadingSpace id="proposal-detail" />;
  }

  const { votingPower } = governancePowersData;

  const {
    againstVotes: againstVotesString,
    description,
    forVotes: forVotesString,
    id,
    minimumDiff: minimumDiffString,
    minimumQuorum: minimumQuorumString,
    shortDescription,
    state: status,
    title,
  } = currentProposal || {};

  const againstVotes = Number(againstVotesString);
  const forVotes = Number(forVotesString);

  const minimumQuorum = Number(minimumQuorumString);
  const minimumDiff = Number(minimumDiffString);

  const totalVotes = getTotalRequiredVotes({
    againstVotes,
    forVotes,
    minimumDiff,
    minimumQuorum,
  });

  const statusLabelKey = getStatusLabelKey({ status });

  let formattedYourVote: React.ReactNode = '-';
  if (votedOnData && votedOnData.hasVoted) {
    formattedYourVote = votedOnData.votedFor ? (
      <GreenSpan>{stringGetter({ key: STRING_KEYS.VOTED_FOR })}</GreenSpan>
    ) : (
      <RedSpan>{stringGetter({ key: STRING_KEYS.VOTED_AGAINST })}</RedSpan>
    );
  }

  return (
    <SectionWrapper column>
      <DetailPageHeader
        ctaConfig={{
          label: stringGetter({
            key: votedOnData?.hasVoted ? STRING_KEYS.VOTED : STRING_KEYS.VOTE,
          }),
          onClick: () => openModal({ type: ModalType.Vote, props: { proposalId: id } }),
          disabled:
            !walletAddress ||
            status !== ProposalStatus.Active ||
            votedOnData?.hasVoted ||
            MustBigNumber(votingPower).isZero(),
          isLoading: !!walletAddress && (!votedOnData || _.isNil(votingPower)),
        }}
        infoModuleConfigs={[
          {
            label: stringGetter({ key: STRING_KEYS.STATUS }),
            value: statusLabelKey ? (
              <StyledProposalStatus>
                {_.includes(
                  [ProposalStatus.Succeeded, ProposalStatus.Queued, ProposalStatus.Executed],
                  status
                ) && (
                  <StyledCheckMark>
                    <CheckMarkIcon />
                  </StyledCheckMark>
                )}
                {_.includes([ProposalStatus.Failed, ProposalStatus.Expired], status) && (
                  <StyledX>
                    <XIcon />
                  </StyledX>
                )}
                {stringGetter({ key: statusLabelKey })}
              </StyledProposalStatus>
            ) : (
              '-'
            ),
          },
          {
            label: stringGetter({ key: STRING_KEYS.YOUR_VOTE }),
            value: formattedYourVote,
          },
        ]}
        label={stringGetter({ key: STRING_KEYS.PROPOSAL })}
        title={title}
        subtitle={shortDescription}
      />
      <VoteSection>
        <VoteContainer>
          <VoteHeader>
            <VoteLabel>{stringGetter({ key: STRING_KEYS.VOTED_FOR })}</VoteLabel>
            <VoteAmount>
              <NumberFormat
                thousandSeparator
                displayType="text"
                value={MustBigNumber(forVotes).toFixed(DecimalPlaces.ShortToken)}
              />
              <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
            </VoteAmount>
          </VoteHeader>
          <VoteMeter totalVotes={totalVotes} totalVotedFor={forVotes} />
        </VoteContainer>
        <VoteContainer>
          <VoteHeader>
            <VoteLabel>{stringGetter({ key: STRING_KEYS.VOTED_AGAINST })}</VoteLabel>
            <VoteAmount>
              <NumberFormat
                thousandSeparator
                displayType="text"
                value={MustBigNumber(againstVotes).toFixed(DecimalPlaces.ShortToken)}
              />
              <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
            </VoteAmount>
          </VoteHeader>
          <VoteMeter totalVotes={totalVotes} totalVotedAgainst={againstVotes} />
        </VoteContainer>
      </VoteSection>
      <DetailPageLayoutContainer>
        <ContentLeft>
          <ProposalDescription>
            <DescriptionLabel>{stringGetter({ key: STRING_KEYS.DESCRIPTION })}</DescriptionLabel>
            <ReactMarkdown>{description}</ReactMarkdown>
          </ProposalDescription>
        </ContentLeft>
        <ContentRight>
          <CardRow>
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.MINIMUM_QUORUM })}
              value={
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(minimumQuorum).toFixed(DecimalPlaces.None)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.REQUIRED_VOTES_TO_PASS })}
            />
            <SingleStatCard
              color={CardColor.Dark}
              title={stringGetter({ key: STRING_KEYS.MINIMUM_DIFF })}
              value={
                <ValueWithIcon>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={MustBigNumber(minimumDiff).toFixed(DecimalPlaces.None)}
                  />
                  <AssetIcon size={AssetIconSize.Small} symbol={AssetSymbol.DYDX} />
                </ValueWithIcon>
              }
              label={stringGetter({ key: STRING_KEYS.DIFFERENCE_IN_VOTES_TO_PASS })}
            />
          </CardRow>
          <ProposalCollapsibleSections>
            <CollapsibleSection
              label={stringGetter({ key: STRING_KEYS.DISCUSS })}
              content={
                <>
                  {stringGetter({ key: STRING_KEYS.PROPOSAL_DISCUSS_DESCRIPTION })}
                  <ButtonContainer>
                    <Button
                      color={ButtonColor.Lighter}
                      linkOutIcon
                      onClick={() => {
                        window.open(ExternalLink.Forums, '_blank');
                      }}
                    >
                      {stringGetter({ key: STRING_KEYS.FORUMS })}
                    </Button>
                    <Button
                      color={ButtonColor.Light}
                      linkOutIcon
                      onClick={() => {
                        window.open(ExternalLink.Discord, '_blank');
                      }}
                    >
                      Discord
                    </Button>
                  </ButtonContainer>
                </>
              }
            />
          </ProposalCollapsibleSections>
        </ContentRight>
      </DetailPageLayoutContainer>
    </SectionWrapper>
  );
};

const VoteSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;

  @media ${breakpoints.mobile} {
    flex-direction: column;
  }

  > div {
    display: flex;
    flex-direction: column;
    flex: 0 0 calc(50% - 1rem);
    width: calc(50% - 1rem);

    @media ${breakpoints.tablet} {
      flex: 0 0 calc(50% - 0.5rem);
      width: calc(50% - 0.5rem);
    }

    @media ${breakpoints.mobile} {
      flex: 1 1 auto;
      width: 100%;

      &:last-child {
        margin-top: 1rem;
      }
    }
  }
`;

const VoteContainer = styled.div`
  padding: 1.25rem 1.5rem 2rem;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.75rem;
`;

const VoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const VoteLabel = styled.div`
  ${fontSizes.size18};
  color: ${({ theme }) => theme.textbase};
`;

const VoteAmount = styled.div`
  ${fontSizes.size24};
  display: flex;
  color: ${({ theme }) => theme.textlight};

  > div {
    margin-left: 0.625rem;
  }
`;

const ProposalDescription = styled.div`
  ${fontSizes.size16}
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;

  @media ${breakpoints.tablet} {
    padding: 1.5rem 0.5rem 0;
  }
`;

const ProposalCollapsibleSections = styled.div`
  padding: 0 0.5rem;

  @media ${breakpoints.tablet} {
    padding: 0;
    margin-top: 1.25rem;
  }
`;

const StyledProposalStatus = styled.div`
  display: flex;
  align-items: center;
`;

const ValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-top: 0.125rem;
    margin-left: 0.375rem;
  }
`;

const DescriptionLabel = styled.div`
  ${fontSizes.size12}
  color: ${({ theme }) => theme.textdark};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size13}
  }
`;

const GreenSpan = styled.span`
  color: ${({ theme }) => theme.colorgreen};
`;

const RedSpan = styled.span`
  color: ${({ theme }) => theme.colorred};
`;

const StyledIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 0.375rem;
  margin-top: 0.125rem;
`;

const StyledCheckMark = styled(StyledIcon)`
  > svg {
    height: 0.75rem;
    width: 0.75rem;
    stroke: ${({ theme }) => theme.colorgreen};
  }
`;

const StyledX = styled(StyledIcon)`
  > svg {
    height: 1rem;
    width: 1rem;

    path {
      stroke: ${({ theme }) => theme.colorred};
    }
  }
`;

const mapStateToProps = (state: RootState) => ({
  governancePowersData: getGovernancePowersData(state),
  latestProposals: getLatestProposals(state),
  walletAddress: getWalletAddress(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
    },
    dispatch
  );

export default withLocalization<ProposalDetailProps>(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ProposalDetail))
);
