import React from 'react';
import { Story, Meta } from '@storybook/react';

import { StakingPool } from '@/enums';
import { withLocalization } from '@/hoc';

import {
  UnconnectedAcknowledgeModal,
  AcknowledgeModalProps,
} from '@/components/Modals/AcknowledgeModal';

export default {
  title: 'Modals/Acknowledge Modal',
  component: UnconnectedAcknowledgeModal,
} as Meta;

const LocalizedAcknowledgeModal = withLocalization(UnconnectedAcknowledgeModal);

const Template: Story<AcknowledgeModalProps> = (args) => (
  <LocalizedAcknowledgeModal {...args} closeModal={() => {}} handleOnAgree={() => {}} />
);

export const Basic = Template.bind({});
Basic.args = {
  stakingPool: undefined,
};

export const LiquidityPool = Template.bind({});
LiquidityPool.args = {
  stakingPool: StakingPool.Liquidity,
};

export const SafetyPool = Template.bind({});
SafetyPool.args = {
  stakingPool: StakingPool.Safety,
};
