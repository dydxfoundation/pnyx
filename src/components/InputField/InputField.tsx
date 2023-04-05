import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { LocalizationProps } from '@/types';

import { breakpoints, fonts, fontSizes } from '@/styles';
import { withLocalization } from '@/hoc';

import { STRING_KEYS } from '@/constants/localization';
import { getDecimalsForNumber } from '@/lib/numbers';

export enum InputFieldType {
  Number = 'Number',
  Text = 'Text',
}

export type InputFieldProps = {
  disabled?: boolean;
  enableSpellCheck?: boolean;
  handleChange: (value: string) => void;
  iconButtonConfig?: {
    icon: React.ReactNode;
    onClickIcon: () => void;
  };
  maxDecimals?: number;
  onClickMax?: () => void;
  placeholder?: string;
  type?: InputFieldType;
  value: string;
} & LocalizationProps;

const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldProps & React.HTMLAttributes<HTMLInputElement>
>(
  (
    {
      disabled,
      enableSpellCheck = true,
      maxDecimals,
      handleChange,
      iconButtonConfig,
      onClickMax,
      placeholder = '0.0000',
      stringGetter,
      type = InputFieldType.Number,
      value,
    },
    ref
  ) => {
    const [temporaryValue, setTemporaryValue] = useState<string | null>(null);

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
      const inputValue: string = (event.target as HTMLInputElement).value;

      if (type === InputFieldType.Text) {
        handleChange(inputValue);
        return;
      }

      // Handle case where user enters a single '.'
      if (maxDecimals !== 0 && inputValue === '.') {
        handleChange('0.');
        setTemporaryValue('0.');
        return;
      }

      // Ignore any inputs that would make the number invalid or negative
      if (Number.isNaN(Number(inputValue)) || Number(inputValue) < 0) {
        handleChange(value);
        return;
      }

      if (temporaryValue) {
        setTemporaryValue(null);
      }

      if (inputValue === '') {
        handleChange(inputValue);
        return;
      }

      if (_.last(inputValue) === '.') {
        if (maxDecimals === 0) {
          handleChange(value);
          return;
        }

        handleChange(inputValue.slice(0, -1));
        setTemporaryValue(inputValue);
        return;
      }

      if (!_.isNil(maxDecimals)) {
        if (getDecimalsForNumber(inputValue) > maxDecimals) {
          handleChange(value);
          return;
        }

        handleChange(inputValue);
        return;
      }

      handleChange(inputValue);
    };

    const Container = disabled ? DisabledInputContainer : InputContainer;

    return (
      <Container fontRegular={type === InputFieldType.Text}>
        <input
          ref={ref}
          inputMode={type === InputFieldType.Text ? 'text' : 'decimal'}
          onChange={onChange}
          placeholder={placeholder}
          value={temporaryValue || value}
          disabled={disabled}
          spellCheck={enableSpellCheck}
        />
        {onClickMax && (
          <InputButton role="button" tabIndex={-1} onClick={onClickMax}>
            {stringGetter({ key: STRING_KEYS.MAX })}
          </InputButton>
        )}
        {iconButtonConfig && (
          <InputButton role="button" tabIndex={-1} onClick={iconButtonConfig.onClickIcon}>
            {iconButtonConfig.icon}
          </InputButton>
        )}
      </Container>
    );
  }
);

const InputContainer = styled.div<{ fontRegular?: boolean }>`
  ${(props) => (props.fontRegular ? '' : fonts.monoRegular)}
  display: flex;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  width: 100%;
  height: 2.5rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.layermediumlight};

  @media ${breakpoints.tablet} {
    height: 3rem;
  }

  > input {
    ${fontSizes.size16}
    ${(props) => (props.fontRegular ? '' : fonts.monoRegular)}
    width: 100%;
    border: 0;
    background-color: ${({ theme }) => theme.layermediumlight};
    color: ${({ theme }) => theme.textlight};
    padding: 0;

    @media ${breakpoints.tablet} {
      ${fontSizes.size18}
    }

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.textdark};
      user-select: none;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const InputButton = styled.div`
  ${fontSizes.size12}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textdark};
  padding: 0 0.75rem;
  margin-right: -0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04rem;
  cursor: pointer;
  user-select: none;
  height: 100%;

  &:hover {
    color: ${({ theme }) => theme.textbase};
  }

  @media ${breakpoints.tablet} {
    ${fontSizes.size14}
  }
`;

const DisabledInputContainer = styled(InputContainer)`
  cursor: not-allowed;

  &:hover {
    cursor: not-allowed;
    filter: none;
  }

  > input {
    cursor: not-allowed;

    &:hover {
      cursor: not-allowed;
      filter: none;
    }
  }

  ${InputButton} {
    pointer-events: none;
  }
`;

export default withLocalization(InputField);
