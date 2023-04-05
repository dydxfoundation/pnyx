import React from 'react';
import { Story, Meta } from '@storybook/react';

import { SingleStatCard, SingleStatCardProps, CardSize } from '@/components/Cards';

export default {
  title: 'Cards/Single Stat Card',
  component: SingleStatCard,
} as Meta;

const Template: Story<SingleStatCardProps> = (args) => <SingleStatCard {...args} />;

export const Example = Template.bind({});
Example.args = {
  title: 'Reward Pool',
  label: 'will be distributed this month',
  value: '12,304',
  size: CardSize.Large,
  tooltip: 'test',
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  title: 'Minted Today',
  value: '12,304',
  size: CardSize.Large,
};

export const Small = Template.bind({});
Small.args = {
  title: 'Minted Today',
  value: '12,304',
  size: CardSize.Small,
};
