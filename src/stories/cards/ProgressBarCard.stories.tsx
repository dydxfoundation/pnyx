import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ProgressBarCard, ProgressBarCardProps, CardSize } from '@/components/Cards';

export default {
  title: 'Cards/Progress bar Card',
  component: ProgressBarCard,
} as Meta;

const Template: Story<ProgressBarCardProps> = (args) => <ProgressBarCard {...args} />;

export const BackgroundLight = Template.bind({});
BackgroundLight.args = {
  backgroundLight: true,
  progress: 0.67,
  progressBarLabels: {
    topLeft: '$303,413',
    topRight: '$450,000',
    bottomLeft: '3.51 unlocked',
  },
  size: CardSize.Medium,
  title: 'Target Volume',
  tooltip: 'test',
};

export const Small = Template.bind({});
Small.args = {
  progress: 0.39,
  progressBarLabels: {
    topLeft: '3,903,413',
    topRight: '10,000,000',
    bottomLeft: '39.03%',
  },
  size: CardSize.Small,
  title: 'Circulating Supply',
  tooltip: 'test',
};
