import { providers } from 'ethers';
import _ from 'lodash';

// @ts-ignore-next-line
import { TxBuilder, EthereumTransactionTypeExtended } from '@dydxprotocol/governance';

import { StakingPool } from 'enums';
import { PoolWithdrawBalancesData } from 'types';

const stakeGasLimitsByStakingPool = {
  [StakingPool.Liquidity]: '0x2BF20', // 180000
  [StakingPool.Safety]: '0x7A120', // 500000
};

class StakingPoolsClient {
  private txBuilder: TxBuilder;

  private provider: providers.ExternalProvider | undefined;

  constructor({ txBuilder }: { txBuilder: TxBuilder }) {
    this.txBuilder = txBuilder;
  }

  private getServiceKey = ({ stakingPool }: { stakingPool: StakingPool }) =>
    stakingPool === StakingPool.Liquidity ? 'liquidityModuleService' : 'safetyModuleService';

  /** For the set allowance transaction, we don't know the stake amount yet, so just default to 1. */
  private getStakingTransactions = async ({
    amount = '1',
    gasLimit,
    stakingPool,
    walletAddress,
  }: {
    amount?: string;
    gasLimit?: string;
    stakingPool: StakingPool;
    walletAddress: string;
  }): Promise<EthereumTransactionTypeExtended[]> => {
    const serviceKey = this.getServiceKey({ stakingPool });

    const transactions = await this.txBuilder[serviceKey].stake(
      walletAddress,
      amount,
      undefined,
      gasLimit
    );

    return transactions;
  };

  setProvider = ({ provider }: { provider?: providers.ExternalProvider }): void => {
    this.provider = provider;
  };

  getPoolData = async ({
    stakingPool,
  }: {
    stakingPool: StakingPool;
  }): Promise<{ poolSize: string; rewardsPerSecond: string }> => {
    const serviceKey = this.getServiceKey({ stakingPool });

    const poolSize = await this.txBuilder[serviceKey].getTotalStake();
    const rewardsPerSecond = await this.txBuilder[serviceKey].getRewardsPerSecond();

    return { poolSize: poolSize.toString(), rewardsPerSecond: rewardsPerSecond.toString() };
  };

  getUserBalancesAndUnclaimedRewards = async ({
    stakingPool,
    walletAddress,
  }: {
    stakingPool: StakingPool;
    walletAddress: string;
  }): Promise<{ userBalance: string; unclaimedRewards: string }> => {
    const serviceKey = this.getServiceKey({ stakingPool });

    const userBalance = await this.txBuilder[serviceKey].getUserStake(walletAddress);
    const unclaimedRewards = await this.txBuilder[serviceKey].getUserUnclaimedRewards(
      walletAddress
    );

    return { userBalance: userBalance.toString(), unclaimedRewards: unclaimedRewards.toString() };
  };

  getAllowance = async ({
    stakingPool,
    walletAddress,
  }: {
    stakingPool: StakingPool;
    walletAddress: string;
  }): Promise<string> => {
    const serviceKey = this.getServiceKey({ stakingPool });
    const allowance = await this.txBuilder[serviceKey].allowance(walletAddress);

    return allowance.toString();
  };

  /**
   * The stake function from each pool service always returns two transactions: the set allowance transaction
   * and the actual stake transaction. For setAllowance and stake, we isolate and only use the relevant transaction.
   */
  setAllowance = async ({
    stakingPool,
    walletAddress,
  }: {
    stakingPool: StakingPool;
    walletAddress: string;
  }): Promise<void> => {
    const transactions = await this.getStakingTransactions({ stakingPool, walletAddress });

    if (_.size(transactions) < 2) {
      return;
    }

    const allowanceTransaction = await transactions[0].tx();

    allowanceTransaction.gas = allowanceTransaction.gasLimit
      ? allowanceTransaction.gasLimit.toString(16)
      : undefined;

    await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [allowanceTransaction],
    });
  };

  stake = async ({
    amount,
    hardcodeGas,
    stakingPool,
    walletAddress,
  }: {
    amount: string;
    hardcodeGas?: boolean;
    stakingPool: StakingPool;
    walletAddress: string;
  }): Promise<string> => {
    const transactions = await this.getStakingTransactions({
      amount,
      gasLimit: hardcodeGas ? stakeGasLimitsByStakingPool[stakingPool] : undefined,
      stakingPool,
      walletAddress,
    });

    const depositTransaction = await _.last(transactions).tx();

    depositTransaction.gas = depositTransaction.gasLimit
      ? depositTransaction.gasLimit.toString(16)
      : undefined;

    if (hardcodeGas) {
      depositTransaction.gas = stakeGasLimitsByStakingPool[stakingPool];
      depositTransaction.gasLimit = stakeGasLimitsByStakingPool[stakingPool];
    }

    const txHash = await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [depositTransaction],
    });

    return txHash;
  };

  getLiquidityPoolWithdrawBalances = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<PoolWithdrawBalancesData> => {
    const availableWithdrawBalance = await this.txBuilder.liquidityModuleService.getUserStakeAvailableToWithdraw(
      walletAddress
    );

    const pendingWithdrawBalance = await this.txBuilder.liquidityModuleService.getUserStakePendingWithdraw(
      walletAddress
    );

    return {
      availableWithdrawBalance,
      pendingWithdrawBalance,
    };
  };

  requestLiquidityPoolWithdraw = async ({
    amount,
    walletAddress,
  }: {
    amount?: string;
    walletAddress: string;
  }): Promise<string> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.liquidityModuleService.requestWithdrawal(
      walletAddress,
      amount
    );

    const requestWithdrawTransaction = await _.first(transactions).tx();

    requestWithdrawTransaction.gas = requestWithdrawTransaction.gasLimit
      ? requestWithdrawTransaction.gasLimit.toString(16)
      : undefined;

    const txHash = await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [requestWithdrawTransaction],
    });

    return txHash;
  };

  withdrawAvailableLiquidityPoolBalance = async ({
    amount,
    walletAddress,
  }: {
    amount?: string;
    walletAddress: string;
  }): Promise<string> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.liquidityModuleService.withdrawStake(
      walletAddress,
      amount,
      walletAddress
    );

    const withdrawTransaction = await _.first(transactions).tx();
    withdrawTransaction.gas = withdrawTransaction.gasLimit;

    withdrawTransaction.gas = withdrawTransaction.gasLimit
      ? withdrawTransaction.gasLimit.toString(16)
      : undefined;

    const txHash = await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [withdrawTransaction],
    });

    return txHash;
  };

  getLiquidityPoolEpochParams = async (): Promise<{
    timeRemainingInCurrentEpoch: string;
    lengthOfBlackoutWindow: string;
  }> => {
    /** Times are returned in seconds. */
    const timeRemainingInCurrentEpoch = await this.txBuilder.liquidityModuleService.getTimeRemainingInCurrentEpoch();
    const lengthOfBlackoutWindow = await this.txBuilder.liquidityModuleService.getLengthOfBlackoutWindow();

    return {
      timeRemainingInCurrentEpoch: timeRemainingInCurrentEpoch.toString(),
      lengthOfBlackoutWindow: lengthOfBlackoutWindow.toString(),
    };
  };
}

export default StakingPoolsClient;
