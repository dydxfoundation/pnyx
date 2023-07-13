import React from 'react';
import { withRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import { SupportedLocale, WalletType } from '@/enums';
import { withLocalization } from '@/hoc';

import { UnconnectedHeader, ConnectedHeaderProps } from '@/components/Header';

export default {
  title: 'Components/Header',
  component: UnconnectedHeader,
} as Meta;

const LocalizedHeader = withLocalization(withRouter(UnconnectedHeader));

const Template: Story<ConnectedHeaderProps> = (args) => <LocalizedHeader {...args} />;

export const NoWallet = Template.bind({});
NoWallet.args = {
  isWalletConnecting: false,
  selectedLocale: SupportedLocale.EN,
};

export const ConnectingWallet = Template.bind({});
ConnectingWallet.args = {
  isWalletConnecting: true,
  selectedLocale: SupportedLocale.JA,
};

export const ConnectedWallet = Template.bind({});
ConnectedWallet.args = {
  isWalletConnecting: false,
  selectedLocale: SupportedLocale.ZH_CN,
  walletAddress: '0x1234567891234567891234567891234567897890',
  walletType: WalletType.MetaMask,
};
