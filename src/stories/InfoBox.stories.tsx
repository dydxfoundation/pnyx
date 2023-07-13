import React from 'react';
import { Story, Meta } from '@storybook/react';

import { WithdrawIcon } from '@/icons';

import InfoBox, { InfoBoxProps } from '@/components/InfoBox';

export default {
  title: 'Components/Info Box',
  component: InfoBox,
} as Meta;

const Template: Story<InfoBoxProps> = (args) => (
  <div style={{ width: 300 }}>
    <InfoBox {...args} />
  </div>
);

export const Example = Template.bind({});
Example.args = {
  title: 'About withdrawals',
  body: 'You must request a withdraw at least two weeks, or 14 days in advance.',
  learnMoreLink: 'https://www.google.com/',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  title: 'Request to withdraw',
  body:
    'Your funds will be available to withdraw once the next epoch starts. If you request your withdraw within the last 7 days of the current epoch, you will have to wait 2 epochs until your funds are withdrawable.',
  icon: <WithdrawIcon />,
  learnMoreLink: 'https://www.google.com/',
};
