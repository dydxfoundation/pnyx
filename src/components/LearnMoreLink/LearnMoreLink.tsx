import { STRING_KEYS } from '@/constants/localization';
import { withLocalization } from '@/hoc';
import React from 'react';
import styled from 'styled-components';

import { LocalizationProps } from '@/types';

export enum LinkColor {
  BaseText = 'BaseText',
  LightText = 'LightText',
  Purple = 'Purple',
}

type ElementProps = {
  color?: LinkColor;
};

export type LearnMoreLinkProps = {
  href: string;
} & LocalizationProps &
  ElementProps;

const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({
  href,
  color = LinkColor.Purple,
  stringGetter,
}) => (
  <Styled.LearnMoreLink color={color} href={href} target="_blank" rel="noopener noreferrer">
    {stringGetter({ key: STRING_KEYS.LEARN_MORE })} →
  </Styled.LearnMoreLink>
);

// eslint-disable-next-line
const Styled: any = {};

Styled.LearnMoreLink = styled.a<ElementProps>`
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  color: ${({ color, theme }) => {
    switch (color) {
      case LinkColor.BaseText: {
        return theme.textbase;
      }
      case LinkColor.LightText: {
        return theme.textlight;
      }
      case LinkColor.Purple: {
        return theme.colorpurple;
      }
    }

    return theme.colorpurple;
  }};

  &:visited {
    color: ${({ color, theme }) => {
      switch (color) {
        case LinkColor.BaseText: {
          return theme.textbase;
        }
        case LinkColor.LightText: {
          return theme.textlight;
        }
        case LinkColor.Purple: {
          return theme.colorpurple;
        }
      }

      return theme.colorpurple;
    }};
  }

  &:hover {
    text-decoration: underline;
  }
`;

export default withLocalization(LearnMoreLink);
