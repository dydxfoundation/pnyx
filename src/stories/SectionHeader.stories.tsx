import React from 'react';
import { Story, Meta } from '@storybook/react';

import SectionHeader, { SectionHeaderProps } from '@/components/SectionHeader';

export default {
  title: 'Components/Section Header',
  component: SectionHeader,
} as Meta;

const Template: Story<SectionHeaderProps> = (args) => <SectionHeader {...args} />;

export const Example = Template.bind({});
Example.args = {
  title: 'Staking pools',
  subtitle: 'Earn rewards for doing staking related stuff',
};
