import { BigNumber, providers } from 'ethers';
import _ from 'lodash';

import type {
  TxBuilder,
  EthereumTransactionTypeExtended,
  UserGovernanceDelegatees,
  Proposal,
  // @ts-ignore-next-line
} from '@dydxfoundation-v3/governance';

import { DelegatePowersTxHashes } from '@/types';

class GovernanceClient {
  private txBuilder: TxBuilder;

  private provider: providers.ExternalProvider | undefined;

  constructor({ txBuilder }: { txBuilder: TxBuilder }) {
    this.txBuilder = txBuilder;
  }

  setProvider = ({ provider }: { provider?: providers.ExternalProvider }): void => {
    this.provider = provider;
  };

  getUserGovernancePowers = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<{ proposalPower: string; votingPower: string }> => {
    const proposalPower = await this.txBuilder.dydxGovernanceService.getCurrentPropositionPower(
      walletAddress
    );

    const votingPower = await this.txBuilder.dydxGovernanceService.getCurrentVotingPower(
      walletAddress
    );

    return { proposalPower, votingPower };
  };

  getUserGovernanceDelegatees = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<UserGovernanceDelegatees> => {
    const delegatees = await this.txBuilder.dydxGovernanceService.getUserDelegatees(walletAddress);
    return delegatees;
  };

  private sendDelegationTransactions = async ({
    delegateStakedToken,
    delegateToken,
    transactions,
  }: {
    delegateStakedToken: boolean;
    delegateToken: boolean;
    transactions: EthereumTransactionTypeExtended[];
  }): Promise<DelegatePowersTxHashes> => {
    let delegateStakedTokenTxHash: string | undefined;
    let delegateTokenTxHash: string | undefined;

    if (delegateStakedToken) {
      const delegateTransaction = await _.last(transactions).tx();

      delegateTransaction.gas = delegateTransaction.gasLimit
        ? `0x${delegateTransaction.gasLimit.toString(16)}`
        : undefined;

      delegateStakedTokenTxHash = await this.provider?.request?.({
        method: 'eth_sendTransaction',
        params: [delegateTransaction],
      });
    }

    if (delegateToken) {
      const delegateTransaction = await _.first(transactions).tx();

      delegateTransaction.gas = delegateTransaction.gasLimit
        ? `0x${delegateTransaction.gasLimit.toString(16)}`
        : undefined;

      delegateTokenTxHash = await this.provider?.request?.({
        method: 'eth_sendTransaction',
        params: [delegateTransaction],
      });
    }

    return {
      delegateStakedTokenTxHash,
      delegateTokenTxHash,
    };
  };

  delegateVotingPower = async ({
    delegatee,
    delegateStakedToken,
    delegateToken,
    walletAddress,
  }: {
    delegatee: string;
    delegateStakedToken: boolean;
    delegateToken: boolean;
    walletAddress: string;
  }): Promise<DelegatePowersTxHashes> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.dydxGovernanceService.delegateVotingPower(
      walletAddress,
      delegatee
    );

    const txHashes = await this.sendDelegationTransactions({
      delegateStakedToken,
      delegateToken,
      transactions,
    });

    return txHashes;
  };

  delegateProposingPower = async ({
    delegatee,
    delegateStakedToken,
    delegateToken,
    walletAddress,
  }: {
    delegatee: string;
    delegateStakedToken: boolean;
    delegateToken: boolean;
    walletAddress: string;
  }): Promise<DelegatePowersTxHashes> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.dydxGovernanceService.delegatePropositionPower(
      walletAddress,
      delegatee
    );

    const txHashes = await this.sendDelegationTransactions({
      delegateStakedToken,
      delegateToken,
      transactions,
    });

    return txHashes;
  };

  delegateAllPowers = async ({
    delegatee,
    delegateStakedToken,
    delegateToken,
    walletAddress,
  }: {
    delegatee: string;
    delegateStakedToken: boolean;
    delegateToken: boolean;
    walletAddress: string;
  }): Promise<DelegatePowersTxHashes> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.dydxGovernanceService.delegatePropositionAndVotingPower(
      walletAddress,
      delegatee
    );

    const txHashes = await this.sendDelegationTransactions({
      delegateStakedToken,
      delegateToken,
      transactions,
    });

    return txHashes;
  };

  getVotingPowerAtBlock = async ({
    block,
    walletAddress,
  }: {
    block: number;
    walletAddress: string;
  }): Promise<string> => {
    const votingPower = await this.txBuilder.dydxGovernanceService.getVotingPowerAt({
      user: walletAddress,
      block,
      strategy: this.txBuilder.dydxGovernanceService.dydxGovernanceStrategyAddress,
    });

    return votingPower;
  };

  getLatestProposals = async (): Promise<Proposal[]> => {
    const proposals = await this.txBuilder.dydxGovernanceService.getLatestProposals(25);
    return proposals;
  };

  voteOnProposal = async ({
    proposalId,
    voteFor,
    walletAddress,
  }: {
    proposalId: number;
    voteFor: boolean;
    walletAddress: string;
  }): Promise<string> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.dydxGovernanceService.submitVote(
      {
        user: walletAddress,
        proposalId,
        support: voteFor,
      }
    );

    const voteTransaction = await _.first(transactions).tx();

    voteTransaction.gas = voteTransaction.gasLimit
      ? `0x${voteTransaction.gasLimit.toString(16)}`
      : undefined;

    const txHash = await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [voteTransaction],
    });

    return txHash;
  };

  getVoteForProposal = async ({
    proposalId,
    walletAddress,
  }: {
    proposalId: number;
    walletAddress: string;
  }): Promise<{ support: boolean; votingPower: BigNumber }> => {
    const voteData = await this.txBuilder.dydxGovernanceService.getVoteOnProposal({
      proposalId,
      user: walletAddress,
    });

    return voteData;
  };
}

export default GovernanceClient;
