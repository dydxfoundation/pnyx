import React from 'react';
import { Story, Meta } from '@storybook/react';

import DetailPageHeader, { DetailPageHeaderProps } from '@/components/DetailPageHeader';

export default {
  title: 'Components/Detail Page Header',
  component: DetailPageHeader,
} as Meta;

const Template: Story<DetailPageHeaderProps> = (args) => <DetailPageHeader {...args} />;

export const Example = Template.bind({});
Example.args = {
  label: 'Pool',
  title: 'Liquidity',
  subtitle: 'Earn rewards for contributing to dYdX liquidity',
};
