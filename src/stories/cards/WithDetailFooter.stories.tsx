import React from 'react';
import { Story, Meta } from '@storybook/react';

import { AssetSymbol } from '@/enums';
import { InfoModuleCard, WithDetailFooter, WithDetailFooterProps } from '@/components/Cards';

export default {
  title: 'Cards/With Detail Footer',
  component: WithDetailFooter,
} as Meta;

const Template: Story<WithDetailFooterProps> = (args) => (
  <WithDetailFooter {...args}>
    <InfoModuleCard
      title="Staking Pool Name"
      subtitle="Created by dYdX"
      symbol={AssetSymbol.DYDX}
      infoModulesConfig={[
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
      ]}
    />
  </WithDetailFooter>
);

export const Example = Template.bind({});
Example.args = {
  ctaConfigs: {
    primary: {
      label: 'Stake',
      onClick: () => {},
    },
    secondary: {
      label: 'Withdraw',
      onClick: () => {},
    },
  },
  label: 'Earned',
  value: '200',
};
