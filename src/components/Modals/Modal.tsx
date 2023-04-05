import React, { useEffect } from 'react';
import styled from 'styled-components';

import { breakpoints } from '@/styles';

export enum ModalSize {
  Medium = 'Medium',
  Large = 'Large',
}

export type ModalProps = {
  children: React.ReactNode;
  size?: ModalSize;
};

export const Modal: React.FC<ModalProps> = ({ children, size = ModalSize.Medium }) => (
  <StyledModal size={size}>{children}</StyledModal>
);

const StyledModal = styled.div<ModalProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.layerlight};
  box-shadow: 0 12px 12px ${({ theme }) => theme.layerbase};
  border-radius: 1rem;
  max-height: calc(100% - 1.5rem);
  overflow: hidden;
  margin: auto;

  width: ${(props) => {
    switch (props.size) {
      case ModalSize.Medium: {
        return '20.5rem';
      }
      case ModalSize.Large: {
        return '26.25rem';
      }
      default: {
        return '20.5rem';
      }
    }
  }};

  @media ${breakpoints.mobile} {
    position: absolute;
    bottom: 0;
    left: 0.25rem;
    border-radius: 1rem 1rem 0 0;
    width: calc(100% - 0.5rem);
  }
`;

export type ModalOverlayProps = {
  children: React.ReactNode;
  onClickOutside: React.MouseEventHandler<HTMLDivElement>;
};

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClickOutside }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClickOutside(e);
    }
  };

  return (
    <StyledModalContainer role="button" tabIndex={0} onClick={handleOnClick}>
      <StyledModalOverlay>
        <div ref={modalRef}>{children}</div>
      </StyledModalOverlay>
    </StyledModalContainer>
  );
};

const StyledModalContainer = styled.div<React.HTMLAttributes<HTMLDivElement>>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
`;

const StyledModalOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  @-moz-document url-prefix() {
    background-color: rgba(11, 11, 19, 0.4);
  }

  backdrop-filter: blur(8px);
`;
