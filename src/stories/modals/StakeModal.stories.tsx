import React from 'react';
import { Story, Meta } from '@storybook/react';
import _ from 'lodash';

import { AllowancesState, StakingBalancesData, WalletBalancesData } from '@/types';
import { AssetSymbol, StakingPool } from '@/enums';
import { withLocalization } from '@/hoc';

import {
  UnconnectedStakeModal,
  ConnectedStakeModalProps,
} from '@/components/Modals/StakeModal/StakeModal';

export default {
  title: 'Modals/Stake Modal',
  component: UnconnectedStakeModal,
} as Meta;

const LocalizedStakeModal = withLocalization(UnconnectedStakeModal);

const Template: Story<ConnectedStakeModalProps> = (args) => (
  <LocalizedStakeModal
    {...args}
    allowances={
      {
        [StakingPool.Liquidity]: {},
        [StakingPool.Safety]: {},
      } as AllowancesState
    }
    stakingBalancesData={
      {
        balances: {
          [StakingPool.Liquidity]: {},
          [StakingPool.Safety]: {},
        },
      } as StakingBalancesData
    }
    walletBalancesData={
      {
        [AssetSymbol.DYDX]: {},
        [AssetSymbol.stDYDX]: {},
        [AssetSymbol.USDC]: {},
      } as WalletBalancesData
    }
    closeModal={_.noop}
  />
);

export const Loading = Template.bind({});
Loading.args = {
  stakingPool: StakingPool.Liquidity,
};

export const LiquidityPool = Template.bind({});
LiquidityPool.args = {
  stakingPool: StakingPool.Liquidity,
};

export const SafetyPool = Template.bind({});
SafetyPool.args = {
  stakingPool: StakingPool.Safety,
};
