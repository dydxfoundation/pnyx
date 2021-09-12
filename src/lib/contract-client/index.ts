import { providers } from 'ethers';
import _ from 'lodash';

import {
  TxBuilder,
  EthereumTransactionTypeExtended,
  dydxTokenAddresses,
  stakingAddresses,
  // @ts-ignore-next-line
} from '@dydxprotocol/governance';

import { TradingRewardsData } from 'types';
import { AssetSymbol } from 'enums';

import GovernanceClient from './governance-client';
import StakingPoolsClient from './staking-pool-client';

const assetSymbolAddresses = {
  [AssetSymbol.DYDX]:
    dydxTokenAddresses[process.env.REACT_APP_NETWORK_KEY]?.TOKEN_ADDRESS ??
    '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
  [AssetSymbol.USDC]:
    process.env.REACT_APP_USDC_ADDRESS ?? '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [AssetSymbol.stDYDX]:
    stakingAddresses[process.env.REACT_APP_NETWORK_KEY]?.SAFETY_MODULE_ADDRESS ??
    '0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC',
};

class ContractClient {
  private txBuilder: TxBuilder;

  private provider: providers.ExternalProvider | undefined;

  public governanceClient: GovernanceClient;

  public stakingPoolClient: StakingPoolsClient;

  constructor() {
    const newTxBuilder = new TxBuilder({
      network: process.env.REACT_APP_NETWORK_KEY,
      injectedProvider: new providers.JsonRpcProvider(
        process.env.REACT_APP_ETHEREUM_NODE_URI,
        Number(process.env.REACT_APP_NETWORK_ID)
      ),
    });

    this.txBuilder = newTxBuilder;

    this.governanceClient = new GovernanceClient({ txBuilder: newTxBuilder });
    this.stakingPoolClient = new StakingPoolsClient({ txBuilder: newTxBuilder });
  }

  injectProvider = ({ provider }: { provider: providers.ExternalProvider }): void => {
    this.provider = provider;
    this.governanceClient.setProvider({ provider });
    this.stakingPoolClient.setProvider({ provider });
  };

  getNetworkIdAndAccounts = async (): Promise<{ networkId?: number; accounts: string[] }> => {
    if (this.provider?.request) {
      const networkIdHex = await this.provider.request({ method: 'eth_chainId' });
      const accounts = await this.provider.request({ method: 'eth_accounts' });

      return { networkId: parseInt(networkIdHex, 16), accounts };
    }

    return {
      networkId: undefined,
      accounts: [],
    };
  };

  getCirculatingSupply = async (): Promise<string> => {
    const circulatingSupply = await this.txBuilder.dydxTokenService.circulatingSupply();
    return circulatingSupply;
  };

  getDistributedToday = async (): Promise<string> => {
    const distributedToday = await this.txBuilder.dydxTokenService.distributedToday();
    return distributedToday;
  };

  getWalletBalance = async ({
    assetSymbol,
    walletAddress,
  }: {
    assetSymbol: AssetSymbol;
    walletAddress: string;
  }): Promise<string> => {
    const balance = await this.txBuilder.erc20Service.balanceOf(
      assetSymbolAddresses[assetSymbol],
      walletAddress
    );

    return balance;
  };

  getUnclaimedRewards = async ({ walletAddress }: { walletAddress: string }): Promise<string> => {
    const unclaimedRewards = await this.txBuilder.claimsProxyService.getUserUnclaimedRewards(
      walletAddress
    );

    return unclaimedRewards;
  };

  getTradingRewardsData = async ({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<TradingRewardsData> => {
    const tradingRewardsData = await this.txBuilder.merkleDistributorService.getUserRewardsData(
      walletAddress
    );

    return tradingRewardsData;
  };

  claimRewards = async ({ walletAddress }: { walletAddress: string }): Promise<string> => {
    const transactions: EthereumTransactionTypeExtended[] = await this.txBuilder.claimsProxyService.claimRewards(
      walletAddress
    );

    const claimTransaction = await _.first(transactions).tx();

    claimTransaction.gas = claimTransaction.gasLimit
      ? `${claimTransaction.gasLimit}`
      : undefined;

    const txHash = await this.provider?.request?.({
      method: 'eth_sendTransaction',
      params: [claimTransaction],
    });

    return txHash;
  };
}

const contractClient = new ContractClient();

export default contractClient;
