import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { DateTime } from 'luxon';
import _ from 'lodash';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

// @ts-ignore-next-line
import type { Proposals } from '@dydxfoundation-v3/governance';

import {
  AppRoute,
  AssetSymbol,
  DecimalPlaces,
  ExternalLink,
  ModalType,
  ProposalStatus,
} from '@/enums';

import { LocalizationProps } from '@/types';
import { AppDispatch, RootState } from '@/store';

import { breakpoints, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';
import { CheckMarkIcon, XIcon } from '@/icons';

import { useGetCountdownDiff, useGetLatestProposals, useGetVotedOnDataForProposal } from '@/hooks';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import Button, { ButtonColor, ButtonContainer } from '@/components/Button';
import VoteMeter from '@/components/VoteMeter';
import { SingleStatCard, CardColor, ValueWithIcon } from '@/components/Cards';

import CollapsibleSection from '@/components/CollapsibleSection';
import DetailPageHeader from '@/components/DetailPageHeader';
import LoadingSpace from '@/components/LoadingSpace';
import SectionWrapper from '@/components/SectionWrapper';

import { openModal as openModalAction } from '@/actions/modals';

import { getWalletAddress } from '@/selectors/wallets';
import { getLatestProposals } from '@/selectors/governance';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';
import { MustBigNumber } from '@/lib/numbers';
import { getStatusLabelKey, getTotalRequiredVotes } from '@/lib/proposals';

import { DetailPageLayoutContainer, ContentLeft, ContentRight, CardRow } from '../DetailPageStyles';

import markdownStyles from './markdown.module.css';

export type ProposalDetailProps = {} & LocalizationProps;

let previousWalletAddress: string | undefined;

const ProposalDetail: React.FC<
  ProposalDetailProps &
    RouteComponentProps<{ proposalId?: string }> &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>
> = ({ history, latestProposals, match, openModal, stringGetter, walletAddress }) => {
  const [currentProposal, setCurrentProposal] = useState<Proposals | undefined>(undefined);
  const [votingEndTimestamp, setVotingEndTimestamp] = useState<string | undefined>(undefined);
  const [votingStartTimestamp, setVotingStartTimestamp] = useState<string | undefined>(undefined);
  const [votingPower, setVotingPower] = useState<string | undefined>(undefined);

  const {
    params: { proposalId: proposalIdString },
  } = match;

  const proposalId = Number(proposalIdString);

  useGetLatestProposals();

  const votedOnData = useGetVotedOnDataForProposal({ proposalId });

  useEffect(() => {
    /**
     * Pull voting power at start of proposal if no voting power was previously pulled, or if the
     * wallet address changes (user changed account).
     */
    if (walletAddress) {
      if (currentProposal && (!votingPower || previousWalletAddress !== walletAddress)) {
        const getVotingPowerAtProposalStart = async () => {
          const votingPowerAtStart = await contractClient.governanceClient.getVotingPowerAtBlock({
            block: currentProposal.startBlock,
            walletAddress,
          });

          setVotingPower(votingPowerAtStart);
        };

        getVotingPowerAtProposalStart();
      }
    } else if (!walletAddress && previousWalletAddress) {
      setVotingPower(undefined);
    }

    previousWalletAddress = walletAddress;
  }, [currentProposal, votingPower, walletAddress]);

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
        setCurrentProposal(proposal);
      } else {
        history.replace(AppRoute.Dashboard);
      }
    }
  }, [history, latestProposals, proposalId, proposalIdString]);

  useEffect(() => {
    if (currentProposal) {
      if (!votingStartTimestamp && !votingEndTimestamp) {
        const getVotingTimestamps = async () => {
          const { endBlock, startBlock } = currentProposal;
          const currentBlockNumber = await contractClient.getCurrentBlockNumber();

          if (currentBlockNumber && startBlock > currentBlockNumber) {
            setVotingStartTimestamp(
              DateTime.local()
                .plus({
                  milliseconds:
                    (startBlock - currentBlockNumber) *
                    Number(import.meta.env.VITE_AVG_BLOCK_TIME),
                })
                .toISO()
            );
          }

          if (currentBlockNumber && endBlock > currentBlockNumber) {
            setVotingEndTimestamp(
              DateTime.local()
                .plus({
                  milliseconds:
                    (endBlock - currentBlockNumber) * Number(import.meta.env.VITE_AVG_BLOCK_TIME),
                })
                .toISO()
            );
          }
        };

        getVotingTimestamps();
      }
    }
  }, [currentProposal, votingEndTimestamp, votingStartTimestamp]);

  const votingStartCountdownDiff = useGetCountdownDiff({
    futureDateISO: votingStartTimestamp,
    stringGetter,
  });

  const votingPeriodCountdownDiff = useGetCountdownDiff({
    futureDateISO: votingEndTimestamp,
    stringGetter,
  });

  if (!currentProposal) {
    return <LoadingSpace id="proposal-detail" />;
  }

  const {
    againstVotes: againstVotesString,
    description,
    dipId,
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

  const infoModuleConfigs = [
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
  ];

  if (status === ProposalStatus.Active) {
    infoModuleConfigs.push({
      label: stringGetter({ key: STRING_KEYS.VOTING_ENDS }),
      value: votingPeriodCountdownDiff ?? '-',
    });
  } else if (status === ProposalStatus.Pending) {
    infoModuleConfigs.push({
      label: stringGetter({ key: STRING_KEYS.VOTING_BEGINS }),
      value: votingStartCountdownDiff ?? '-',
    });
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
        infoModuleConfigs={infoModuleConfigs}
        label={stringGetter({ key: STRING_KEYS.PROPOSAL })}
        title={`DIP ${dipId} - ${title}`}
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
            <ReactMarkdown
              className={markdownStyles.markdown}
              linkTarget="_blank"
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
            >
              {description}
            </ReactMarkdown>
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
  margin-top: 1rem;

  @media ${breakpoints.tablet} {
    padding: 0;
  }
`;

const StyledProposalStatus = styled.div`
  display: flex;
  align-items: center;
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
