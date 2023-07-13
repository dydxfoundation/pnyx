import React from 'react';
import { Story, Meta } from '@storybook/react';

import { InfoCtaCard, InfoCtaCardProps } from '@/components/Cards';

export default {
  title: 'Cards/Info CTA Card',
  component: InfoCtaCard,
} as Meta;

const Template: Story<InfoCtaCardProps> = (args) => <InfoCtaCard {...args} />;

export const Title = Template.bind({});
Title.args = {
  label: 'Propose an idea',
  title: 'Suggest a new pool',
  ctaConfigs: {
    primary: {
      label: 'Forums',
      onClick: () => {},
      linkOutIcon: true,
    },
    secondary: {
      label: 'Discord',
      onClick: () => {},
      linkOutIcon: true,
    },
  },
};

export const Body = Template.bind({});
Body.args = {
  label: 'Liquidity mining',
  body: 'Rewards are based on your volume and open interest on our exchange.',
  ctaConfigs: {
    primary: {
      label: 'Trade',
      onClick: () => {},
      linkOutIcon: true,
    },
    secondary: {
      label: 'Learn more',
      onClick: () => {},
      linkOutIcon: false,
    },
  },
};
