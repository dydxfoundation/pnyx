import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import AnimatedHamburgerClose, {
  AnimatedHamburgerCloseProps,
} from '@/components/AnimatedHamburgerClose';

export default {
  title: 'Components/Animated Hamburger Close',
  component: AnimatedHamburgerClose,
} as Meta;

const Template: Story<AnimatedHamburgerCloseProps> = (args) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
    <div
      tabIndex={0}
      role="button"
      style={{ padding: 40, width: 300 }}
      onClick={() => setIsActive(!isActive)}
    >
      <AnimatedHamburgerClose {...args} isActive={isActive} />
    </div>
  );
};

export const Example = Template.bind({});
Example.args = {};
