import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AssetSymbol } from '@/enums';
import AssetIcon, { AssetIconProps, AssetIconSize } from '@/components/AssetIcon';

export default {
  title: 'Components/Asset Icon',
  component: AssetIcon,
} as Meta;

const Template: Story<AssetIconProps> = (args) => (
  <div style={{ padding: 40 }}>
    <AssetIcon {...args} />
  </div>
);

export const Dydx = Template.bind({});
Dydx.args = {
  size: AssetIconSize.Large,
  symbol: AssetSymbol.DYDX,
};

export const Usdc = Template.bind({});
Usdc.args = {
  size: AssetIconSize.Large,
  symbol: AssetSymbol.USDC,
};

export const Tiny = Template.bind({});
Tiny.args = {
  size: AssetIconSize.Tiny,
  symbol: AssetSymbol.DYDX,
};

export const Small = Template.bind({});
Small.args = {
  size: AssetIconSize.Small,
  symbol: AssetSymbol.DYDX,
};

export const Medium = Template.bind({});
Medium.args = {
  size: AssetIconSize.Medium,
  symbol: AssetSymbol.DYDX,
};

export const Large = Template.bind({});
Large.args = {
  size: AssetIconSize.Large,
  symbol: AssetSymbol.DYDX,
};

export const Huge = Template.bind({});
Huge.args = {
  size: AssetIconSize.Huge,
  symbol: AssetSymbol.DYDX,
};
