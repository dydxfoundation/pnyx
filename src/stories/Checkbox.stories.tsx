import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import Checkbox, { CheckboxProps } from '@/components/Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
} as Meta;

const Template: Story<CheckboxProps> = (args) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div style={{ padding: 40, width: 400 }}>
      <Checkbox {...args} checked={checked} onClick={() => setChecked(!checked)} />
    </div>
  );
};

export const MaxDecimals = Template.bind({});
MaxDecimals.args = { label: 'I am a checkbox' };
