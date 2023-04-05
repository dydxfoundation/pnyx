import React from 'react';
import styled from 'styled-components';

export enum DiffArrowColor {
  Gray = 'Gray',
  Green = 'Green',
  Red = 'Red',
}

export enum DiffArrowDirection {
  Left = 'Left',
  Right = 'Right',
}

type ElementProps = {
  color: DiffArrowColor;
};

export type DiffArrowProps = {
  direction: DiffArrowDirection;
} & ElementProps;

const DiffArrow: React.FC<DiffArrowProps> = ({ color, direction }) => (
  <StyledDiffArrow color={color}>
    {direction === DiffArrowDirection.Left ? '←' : '→'}
  </StyledDiffArrow>
);

const StyledDiffArrow = styled.div<ElementProps>`
  display: inline;
  position: relative;
  top: 0.0625rem;
  margin: 0 0.25rem;

  color: ${(props) => {
    switch (props.color) {
      case DiffArrowColor.Green: {
        return props.theme.colorgreen;
      }
      case DiffArrowColor.Red: {
        return props.theme.colorred;
      }
      default: {
        return props.theme.textbase;
      }
    }
  }};
`;

export default DiffArrow;
