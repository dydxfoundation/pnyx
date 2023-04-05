import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';
import { CloseIcon } from '@/icons';

type ElementProps = {
  dark?: boolean;
  noBorder?: boolean;
};

export type ModalHeaderProps = {
  closeModal?: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
} & ElementProps;

const ModalHeader: React.FC<ModalHeaderProps> = ({
  dark,
  subtitle,
  title,
  noBorder,
  closeModal,
}) => (
  <StyledModalHeader dark={dark} noBorder={noBorder} verticalPadding={!!subtitle}>
    <div>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </div>
    {closeModal && (
      <CloseButton role="button" tabIndex={0} onClick={closeModal}>
        <CloseIcon />
      </CloseButton>
    )}
  </StyledModalHeader>
);

const StyledModalHeader = styled.div<ElementProps & { verticalPadding?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem;
  padding: 1.5rem 1rem 1rem 1.75rem;
  color: ${(props) => (props.dark ? props.theme.textdark : props.theme.textlight)};
  border-bottom: ${(props) => {
    if (props.noBorder) {
      return 'none';
    }

    return `solid 0.0625rem ${props.theme.bordergrey}`;
  }};

  ${(props) =>
    props.verticalPadding
      ? `
        padding-top: 1.5rem; 
        padding-bottom: 1rem;`
      : ''}
`;

const Title = styled.div`
  ${fontSizes.size18};
  display: flex;
  align-items: center;

  @media ${breakpoints.tablet} {
    ${fontSizes.size20};
  }
`;

const Subtitle = styled.div`
  ${fontSizes.size14};
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.5rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

const CloseButton = styled.div`
  cursor: pointer;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  border-radius: 0.375rem;
  margin: -0.5rem 0 -0.5rem 0.75rem;

  &:hover {
    background-color: ${({ theme }) => theme.layerlighter};

    > svg path {
      stroke: ${({ theme }) => theme.textlight};
    }
  }
`;

export default ModalHeader;
