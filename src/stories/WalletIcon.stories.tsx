import React from 'react';
import { Story, Meta } from '@storybook/react';

import { WalletType } from '@/enums';
import WalletIcon, { WalletIconProps } from '@/components/WalletIcon';

export default {
  title: 'Components/Wallet Icon',
  component: WalletIcon,
} as Meta;

const Template: Story<WalletIconProps> = (args) => (
  <div style={{ padding: '2rem' }}>
    <WalletIcon {...args} />
  </div>
);

export const CoinbaseWallet = Template.bind({});
CoinbaseWallet.args = {
  walletType: WalletType.CoinbaseWallet,
};

export const ImToken = Template.bind({});
ImToken.args = {
  walletType: WalletType.ImToken,
};

export const MetaMask = Template.bind({});
MetaMask.args = {
  walletType: WalletType.MetaMask,
};

export const Rainbow = Template.bind({});
Rainbow.args = {
  walletType: WalletType.Rainbow,
};

export const TrustWallet = Template.bind({});
TrustWallet.args = {
  walletType: WalletType.TrustWallet,
};

export const WalletConnect = Template.bind({});
WalletConnect.args = {
  walletType: WalletType.WalletConnect,
};
