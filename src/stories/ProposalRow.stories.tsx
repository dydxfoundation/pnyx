import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ProposalStatus } from '@/enums';
import ProposalRow, { ProposalRowProps } from '@/components/ProposalRow';

export default {
  title: 'Components/Proposal Row',
  component: ProposalRow,
} as Meta;

const Template: Story<ProposalRowProps> = (args) => <ProposalRow {...args} />;

const baseProposal = {
  againstVotes: '0',
  forVotes: '0',
  minimumDiff: '500',
  minimumQuorum: '2000',
  title: 'Add new SHIB-USD market',
};

export const Pending = Template.bind({});
Pending.args = {
  proposal: {
    ...baseProposal,
    state: ProposalStatus.Pending,
  },
};

export const Canceled = Template.bind({});
Canceled.args = {
  proposal: {
    ...baseProposal,
    state: ProposalStatus.Canceled,
  },
};

export const Active = Template.bind({});
Active.args = {
  proposal: {
    ...baseProposal,
    againstVotes: '1800',
    forVotes: '2100',
    state: ProposalStatus.Active,
  },
};

export const Succeeded = Template.bind({});
Succeeded.args = {
  proposal: {
    ...baseProposal,
    againstVotes: '1800',
    forVotes: '2600',
    state: ProposalStatus.Succeeded,
  },
};

export const Failed = Template.bind({});
Failed.args = {
  proposal: {
    ...baseProposal,
    againstVotes: '1000',
    forVotes: '800',
    state: ProposalStatus.Failed,
  },
};

export const Queued = Template.bind({});
Queued.args = {
  proposal: {
    ...baseProposal,
    againstVotes: '1200',
    forVotes: '2000',
    state: ProposalStatus.Queued,
  },
};

export const Executed = Template.bind({});
Executed.args = {
  proposal: {
    ...baseProposal,
    againstVotes: '1300',
    forVotes: '2400',
    state: ProposalStatus.Executed,
  },
};
