import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

type ElementProps = {
  checked: boolean;
};

export type CheckboxProps = {
  label: React.ReactNode;
  onClick: () => void;
} & ElementProps;

const Checkbox: React.FC<CheckboxProps> = ({ checked, label, onClick }) => (
  <CheckboxWrapper>
    <StyledCheckbox role="button" tabIndex={0} onClick={onClick}>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <CustomCheckbox />
      {label && <Label checked={checked}>{label}</Label>}
    </StyledCheckbox>
  </CheckboxWrapper>
);

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CustomCheckbox = styled.span`
  position: absolute;
  top: calc(50% - 0.625rem);
  left: 0;
  height: 1.25rem;
  width: 1.25rem;
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.25rem;
  z-index: 0;
  cursor: pointer;

  &::after {
    position: absolute;
    content: '';
    top: 0.25rem;
    left: 0.4375rem;
    width: 0.3125rem;
    height: 0.5rem;
    border: solid ${({ theme }) => theme.textlight};
    border-width: 0 0.125rem 0.125rem 0;
    border-radius: 0.0625rem;
    opacity: 0;
    transform: rotate(0deg) scale(0);
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  }
`;

const StyledCheckbox = styled.div`
  display: flex;
  position: relative;
  align-items: center;

  > input {
    position: absolute;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
    height: 1.25rem;
    width: 1.25rem;
    margin: 0;

    &:checked ~ ${CustomCheckbox}::after {
      opacity: 1;
      transform: rotate(40deg) scale(1);
    }
  }
`;

const Label = styled.div<ElementProps>`
  ${fontSizes.size14}
  display: flex;
  align-items: center;
  padding-left: 1.875rem;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  color: ${(props) => (props.checked ? props.theme.textlight : props.theme.textdark)};
  transition: color 0.2s ease;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }
`;

export default Checkbox;
