import React from 'react';
import { Story, Meta } from '@storybook/react';

import { WalletBalancesData } from '@/types';
import { withLocalization } from '@/hoc';

import { UnconnectedClaimModal, ConnectedClaimModalProps } from '@/components/Modals/ClaimModal';
import { AssetSymbol } from '@/enums';

export default {
  title: 'Modals/Claim Modal',
  component: UnconnectedClaimModal,
} as Meta;

const LocalizedClaimModal = withLocalization(UnconnectedClaimModal);

const Template: Story<ConnectedClaimModalProps> = (args) => <LocalizedClaimModal {...args} />;

export const Example = Template.bind({});
Example.args = {
  unclaimedRewardsData: {
    unclaimedRewards: '12309.034',
  },
  walletBalancesData: {
    [AssetSymbol.DYDX]: {
      balance: '300',
    },
  } as WalletBalancesData,
};

export const Loading = Template.bind({});
Loading.args = {
  unclaimedRewardsData: {},
  walletBalancesData: {
    [AssetSymbol.DYDX]: {},
  } as WalletBalancesData,
};
