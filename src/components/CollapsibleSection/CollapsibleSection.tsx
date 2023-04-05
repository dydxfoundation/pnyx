import React, { useState } from 'react';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import _ from 'lodash';

import { breakpoints, fonts, fontSizes } from '@/styles';

type ElementProps = {
  collapsible?: boolean;
};

export type CollapsibleSectionProps = {
  label: string;
  content: React.ReactNode;
} & ElementProps;

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  content,
  collapsible = true,
}) => {
  const [showText, setShowText] = useState<boolean>(true);

  return (
    <CollapsibleSectionContainer showText={showText}>
      <Header
        collapsible={collapsible}
        onClick={collapsible ? () => setShowText(!showText) : _.noop}
      >
        {label}
        {collapsible && <PlusMinusIcon showText={showText} />}
      </Header>
      <Collapse isOpened={showText}>
        <Content>{content}</Content>
      </Collapse>
    </CollapsibleSectionContainer>
  );
};

const CollapsibleSectionContainer = styled.div<{ showText: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:not(:last-child) {
    border-bottom: solid 0.0625rem ${({ theme }) => theme.bordergrey};
  }
`;

const Header = styled.div<ElementProps>`
  ${fontSizes.size12}
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.75rem;
  color: ${({ theme }) => theme.textdark};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: ${(props) => (props.collapsible ? 'pointer' : 'default')};

  @media ${breakpoints.tablet} {
    ${fontSizes.size13}
  }
`;

const PlusMinusIcon = styled.div<{ showText: boolean }>`
  transition: transform 0.3s;
  width: 0.75rem;
  height: 0.75rem;
  transform: rotate(180deg);
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 0.75rem;
    height: 0;
    border-bottom: solid 0.125rem ${({ theme }) => theme.textdark};
    position: absolute;
    bottom: 0.3125rem;
    transform: rotate(90deg);
    transition: width 0.3s;
  }

  &::after {
    content: '';
    display: block;
    width: 0.75rem;
    height: 0;
    border-bottom: solid 0.125rem ${({ theme }) => theme.textdark};
    position: absolute;
    bottom: 0.3125rem;
  }

  ${(props) =>
    props.showText
      ? `    
        transform: rotate(0deg);

        &::before {
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-bottom: solid 0.125 ${props.theme.textdark};
          position: absolute;
          bottom: 0.3125rem;
          transform: rotate(90deg);
        }
      `
      : ''}
`;

const Content = styled.div`
  ${fonts.regular}
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textbase};
  padding-bottom: 1rem;
  letter-spacing: -0.01rem;
`;

export default CollapsibleSection;
