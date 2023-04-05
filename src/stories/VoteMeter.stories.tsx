import React from 'react';
import { Story, Meta } from '@storybook/react';

import VoteMeter, { VoteMeterProps } from '@/components/VoteMeter';

export default {
  title: 'Components/Vote Meter',
  component: VoteMeter,
} as Meta;

const Template: Story<VoteMeterProps> = (args) => (
  <div style={{ maxWidth: 400, padding: 40 }}>
    <VoteMeter {...args} />
  </div>
);

export const BothVoteTypes = Template.bind({});
BothVoteTypes.args = {
  halfwayMarker: true,
  totalVotes: 100,
  totalVotedFor: 34,
  totalVotedAgainst: 16,
};

export const VotesFor = Template.bind({});
VotesFor.args = {
  totalVotes: 100,
  totalVotedFor: 55,
};

export const VotesAgainst = Template.bind({});
VotesAgainst.args = {
  totalVotes: 100,
  totalVotedAgainst: 82,
};
