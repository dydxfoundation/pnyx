import React from 'react';
import { Story, Meta } from '@storybook/react';

import AlertMessage, { AlertMessageProps, AlertMessageType } from '@/components/AlertMessage';

export default {
  title: 'Components/Alert Message',
  component: AlertMessage,
} as Meta;

const Template: Story<AlertMessageProps> = (args) => (
  <div style={{ padding: 40, width: 300 }}>
    <AlertMessage {...args} />
  </div>
);

export const Error = Template.bind({});
Error.args = {
  type: AlertMessageType.Error,
  message: 'Please enter a valid Ethereum wallet address.',
};

export const Warning = Template.bind({});
Warning.args = {
  type: AlertMessageType.Warning,
  message: 'Your withdraw will not be available until the next epoch.',
};
