import React from 'react';
import { Story, Meta } from '@storybook/react';

import LoadingSpace, { LoadingSpaceProps } from '@/components/LoadingSpace';

export default {
  title: 'Components/Loading Space',
  component: LoadingSpace,
} as Meta;

const Template: Story<LoadingSpaceProps> = (args) => <LoadingSpace {...args} />;

export const Example = Template.bind({});
Example.args = {};
