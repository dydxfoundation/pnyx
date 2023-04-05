import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button from '@/components/Button';
import WithReceipt, { WithReceiptProps } from '@/components/WithReceipt';

export default {
  title: 'Components/With Receipt',
  component: WithReceipt,
} as Meta;

const Template: Story<WithReceiptProps> = (args) => (
  <div style={{ width: 400 }}>
    <WithReceipt
      {...args}
      receiptConfig={[
        { key: 'Balance', label: 'Balance', value: '2,000' },
        { key: 'Withdrawable', label: 'Withdrawable', value: 'May 20, 2020', fontRegular: true },
      ]}
    >
      <Button fullWidth onClick={() => {}}>
        Test
      </Button>
    </WithReceipt>
  </div>
);

export const ReceiptOnBottom = Template.bind({});
ReceiptOnBottom.args = {};

export const ReceiptOnTop = Template.bind({});
ReceiptOnTop.args = {
  receiptOnTop: true,
};
