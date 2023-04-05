import React from 'react';
import { Story, Meta } from '@storybook/react';

import TruncateHash, { TruncateHashProps } from '@/components/TruncateHash';

export default {
  title: 'Components/Truncate Hash',
  component: TruncateHash,
} as Meta;

const Template: Story<TruncateHashProps> = (args) => <TruncateHash {...args} />;

export const Example = Template.bind({});
Example.args = {
  hash: '0x1234567891234567891234567891234567891234',
};
