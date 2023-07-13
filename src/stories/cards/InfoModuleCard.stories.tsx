import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AssetSymbol } from '@/enums';
import { InfoModuleCard, InfoModuleCardProps } from '@/components/Cards';

export default {
  title: 'Cards/Info Module Card',
  component: InfoModuleCard,
} as Meta;

const Template: Story<InfoModuleCardProps> = (args) => <InfoModuleCard {...args} />;

export const Example = Template.bind({});
Example.args = {
  title: 'Staking Pool Name',
  subtitle: 'Created by dYdX',
  symbol: AssetSymbol.DYDX,
  infoModulesConfig: [
    {
      label: 'Liquidity',
      value: '$817.1m',
    },
    {
      label: 'Weekly APR',
      value: '12.45%',
    },
    {
      label: 'Your Size',
      value: '-',
    },
  ],
};
