import React from 'react';
import { Story, Meta } from '@storybook/react';
import _ from 'lodash';

import { withLocalization } from '@/hoc';

import TradeLinkModal, { TradeLinkModalProps } from '@/components/Modals/TradeLinkModal';

export default {
  title: 'Modals/Trade Link Modal',
  component: TradeLinkModal,
} as Meta;

const LocalizedTradeLinkModal = withLocalization(TradeLinkModal);

const Template: Story<TradeLinkModalProps> = (args) => (
  <LocalizedTradeLinkModal {...args} closeModal={_.noop} />
);

export const Example = Template.bind({});
Example.args = {};
