import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import _ from 'lodash';

import InputField, { InputFieldProps } from '@/components/InputField';

export default {
  title: 'Components/Input Field',
  component: InputField,
} as Meta;

const Template: Story<InputFieldProps> = (args) => {
  const [value, setValue] = useState<string>('');

  return (
    <div style={{ padding: 40, width: 400 }}>
      <InputField {...args} value={value} handleChange={(newValue: string) => setValue(newValue)} />
    </div>
  );
};

export const MaxDecimals = Template.bind({});
MaxDecimals.args = { maxDecimals: 6 };

export const WithMaxButton = Template.bind({});
WithMaxButton.args = { onClickMax: _.noop };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, onClickMax: _.noop };
