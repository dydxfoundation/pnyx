import React from 'react';
import { Story, Meta } from '@storybook/react';

import LoadingSpinner, { SpinnerSize, LoadingSpinnerProps } from '@/components/LoadingSpinner';

export default {
  title: 'Components/Loading Spinner',
  component: LoadingSpinner,
} as Meta;

const Template: Story<LoadingSpinnerProps> = (args) => <LoadingSpinner {...args} />;

export const Medium = Template.bind({});
Medium.args = {
  size: SpinnerSize.Medium,
};

export const Large = Template.bind({});
Large.args = {
  size: SpinnerSize.Large,
};
