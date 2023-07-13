import React from 'react';
import styled from 'styled-components';

import { breakpoints, fonts, fontSizes } from '@/styles';

type ReceiptConfigElementProps = {
  fontRegular?: boolean;
};

type ReceiptConfig = {
  key: string;
  label: React.ReactNode;
  value: React.ReactNode;
} & ReceiptConfigElementProps;

type ElementProps = {
  receiptOnTop?: boolean;
};

export type WithReceiptProps = {
  children: React.ReactNode;
  receiptConfig: ReceiptConfig[];
} & ElementProps;

const WithReceipt: React.FC<WithReceiptProps> = ({ children, receiptConfig, receiptOnTop }) => (
  <StyledWithReceipt receiptOnTop={receiptOnTop}>
    {!receiptOnTop && children}
    <ReceiptContainer>
      {receiptConfig.map(({ key, label, value, fontRegular }) => (
        <ReceiptRow key={key}>
          <ReceiptLabel>{label}</ReceiptLabel>
          <ReceiptValue fontRegular={fontRegular}>{value}</ReceiptValue>
        </ReceiptRow>
      ))}
    </ReceiptContainer>
    {receiptOnTop && children}
  </StyledWithReceipt>
);

const StyledWithReceipt = styled.div<ElementProps>`
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.layerdark};
  margin-top: ${(props) => (props.receiptOnTop ? '0.75rem' : '0')};
`;

const ReceiptContainer = styled.div`
  padding: 0.5rem 0.75rem;
  width: 100%;
  color: ${({ theme }) => theme.textdark};
`;

const ReceiptRow = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textdark};
  min-height: 1.75rem;
  padding: 0.25rem 0;
`;

const ReceiptLabel = styled.div`
  ${fontSizes.size14}
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  white-space: nowrap;

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

const ReceiptValue = styled.span<ReceiptConfigElementProps>`
  ${(props) => (props.fontRegular ? fonts.medium : fonts.monoRegular)}
  ${fontSizes.size13}
  display: flex;
  justify-content: flex-end;
  flex: 1 1 auto;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.textbase};
  margin-left: auto;
  padding-left: 1rem;
  overflow: hidden;

  @media ${breakpoints.tablet} {
    ${fontSizes.size14}
  }

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default WithReceipt;
