import React from 'react';
import { Story, Meta } from '@storybook/react';

import CollapsibleSection, { CollapsibleSectionProps } from '@/components/CollapsibleSection';

export default {
  title: 'Components/Collapsible Section',
  component: CollapsibleSection,
} as Meta;

const Template: Story<CollapsibleSectionProps> = (args) => (
  <>
    <CollapsibleSection {...args} />
    <CollapsibleSection {...args} />
  </>
);

export const Example = Template.bind({});
Example.args = {
  collapsible: true,
  content:
    'In the case of a shortfall event, the Safety Module uses up to 30% of the assets locked to cover the deficit. ',
  label: 'Risks',
};
