import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { VotedOnProposalData } from '@/types';

import { setVotedOnProposal } from '@/actions/governance';

import { getVotedOnProposals } from '@/selectors/governance';
import { getWalletAddress } from '@/selectors/wallets';

import contractClient from '@/lib/contract-client';

const useGetVotedOnDataForProposal = ({
  proposalId,
}: {
  proposalId: number;
}): VotedOnProposalData | undefined => {
  const dispatch = useDispatch();

  const votedOnProposals = useSelector(getVotedOnProposals, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const [currentVotedOnProposal, setCurrentVotedOnProposal] = useState<
    VotedOnProposalData | undefined
  >();

  const requestVoteForProposal = async () => {
    const { support, votingPower } = await contractClient.governanceClient.getVoteForProposal({
      proposalId,
      walletAddress: walletAddress as string,
    });

    const votedOnData = { proposalId, votedFor: support, hasVoted: !votingPower.isZero() };

    dispatch(setVotedOnProposal(votedOnData));
    setCurrentVotedOnProposal(votedOnData);
  };

  useEffect(() => {
    if (walletAddress) {
      const votedOnProposal = _.find(
        votedOnProposals,
        ({ proposalId: votedOnId }) => votedOnId === proposalId
      );

      if (!votedOnProposal) {
        requestVoteForProposal();
      } else {
        setCurrentVotedOnProposal(votedOnProposal);
      }
    } else {
      setCurrentVotedOnProposal(undefined);
    }
  }, [votedOnProposals, walletAddress]);

  return currentVotedOnProposal;
};

export default useGetVotedOnDataForProposal;
