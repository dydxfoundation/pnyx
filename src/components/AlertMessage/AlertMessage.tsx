import React from 'react';
import styled from 'styled-components';

import { breakpoints, fontSizes } from '@/styles';

export enum AlertMessageType {
  Error = 'Error',
  Warning = 'Warning',
}

type ElementProps = {
  type: AlertMessageType;
};

export type AlertMessageProps = {
  message: React.ReactNode;
} & ElementProps;

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => (
  <StyledAlertMessage type={type}>
    <Message>{message}</Message>
  </StyledAlertMessage>
);

const StyledAlertMessage = styled.div<ElementProps>`
  ${fontSizes.size14}
  border-radius: 0.25rem;
  padding: 0.625rem 0.75rem;
  margin-top: 0.75rem;
  max-height: 18rem;
  word-break: break-word;
  overflow: scroll;

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
    line-height: 1.25rem;
  }

  ${({ theme, type }) => {
    switch (type) {
      case AlertMessageType.Error: {
        return `
          background: rgba(255, 85, 85, 0.1);
          border-left: 0.25rem solid ${theme.colorred};
          color: ${theme.textlight};
        `;
      }
      case AlertMessageType.Warning: {
        return `
          background: rgba(255, 200, 70, 0.1);
          border-left: 0.25rem solid ${theme.coloryellow};
          color: ${theme.textlight};
        `;
      }
      default: {
        return '';
      }
    }
  }}
`;

const Message = styled.div`
  margin-top: 0.125rem;
`;

export default AlertMessage;
