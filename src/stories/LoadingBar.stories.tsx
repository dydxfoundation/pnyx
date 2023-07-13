import React from 'react';
import { Story, Meta } from '@storybook/react';

import LoadingBar, { LoadingBarProps } from '@/components/LoadingBar';

export default {
  title: 'Components/Loading Bar',
  component: LoadingBar,
} as Meta;

const Template: Story<LoadingBarProps> = (args) => <LoadingBar {...args} />;

export const Example = Template.bind({});
Example.args = {
  height: 1.5,
  width: 9,
};
