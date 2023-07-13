import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button, { ButtonColor, ButtonProps } from '@/components/Button';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => {
  const button = <Button {...args}>Button</Button>;
  return args.isLoading ? <div style={{ width: 200 }}>{button}</div> : button;
};

export const Purple = Template.bind({});
Purple.args = {};

export const Lighter = Template.bind({});
Lighter.args = {
  color: ButtonColor.Lighter,
};

export const Light = Template.bind({});
Light.args = {
  color: ButtonColor.Light,
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  fullWidth: true,
};

export const LinkOut = Template.bind({});
LinkOut.args = {
  color: ButtonColor.Lighter,
  linkOutIcon: true,
};
