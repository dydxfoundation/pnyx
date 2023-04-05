import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AssetSymbol } from '@/enums';
import { WalletBalancesData } from '@/types';

import { withLocalization } from '@/hoc';

import {
  UnconnectedDelegateModal,
  ConnectedDelegateModalProps,
} from '@/components/Modals/DelegateModal';

export default {
  title: 'Modals/Delegate Modal',
  component: UnconnectedDelegateModal,
} as Meta;

const LocalizedDelegateModal = withLocalization(UnconnectedDelegateModal);

const Template: Story<ConnectedDelegateModalProps> = (args) => <LocalizedDelegateModal {...args} />;

export const OneToken = Template.bind({});
OneToken.args = {
  walletBalancesData: {
    [AssetSymbol.DYDX]: {
      balance: '230',
    },
    [AssetSymbol.stDYDX]: {
      balance: '0',
    },
  } as WalletBalancesData,
};

export const BothTokens = Template.bind({});
BothTokens.args = {
  walletBalancesData: {
    [AssetSymbol.DYDX]: {
      balance: '230',
    },
    [AssetSymbol.stDYDX]: {
      balance: '40',
    },
  } as WalletBalancesData,
};
