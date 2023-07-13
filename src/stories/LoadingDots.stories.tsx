import React from 'react';
import { Story, Meta } from '@storybook/react';

import LoadingDots, { LoadingDotsProps } from '@/components/LoadingDots';

export default {
  title: 'Components/Loading Dots',
  component: LoadingDots,
} as Meta;

const Template: Story<LoadingDotsProps> = (args) => <LoadingDots {...args} />;

export const Example = Template.bind({});
Example.args = {};
