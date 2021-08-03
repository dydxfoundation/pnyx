import React from 'react';
import styled from 'styled-components/macro';

import { ProposalStatus } from 'enums';

import {
  StatusActive,
  StatusCanceled,
  StatusExecuted,
  StatusFailed,
  StatusPending,
  StatusQueued,
  StatusSuccess,
} from 'icons';

export enum ProposalStatusSize {
  Medium = 'Medium',
  Large = 'Large',
}

type ElementProps = {
  size: ProposalStatusSize;
};

export type ProposalStatusIconProps = {
  status: ProposalStatus;
} & ElementProps;

// In some strange cases, hiding a spinner on one part of the page causes the linearGradient to
// be hidden on all other instances of the page. An id can be passed in to prevent this.
const ProposalStatusIcon: React.FC<ProposalStatusIconProps> = ({
  size = ProposalStatusSize.Medium,
  status,
}) => {
  let icon;
  switch (status) {
    case ProposalStatus.Active: {
      icon = <StatusActive />;
      break;
    }
    case ProposalStatus.Canceled: {
      icon = <StatusCanceled />;
      break;
    }
    case ProposalStatus.Executed: {
      icon = <StatusExecuted />;
      break;
    }
    case ProposalStatus.Failed: {
      icon = <StatusFailed />;
      break;
    }
    case ProposalStatus.Pending: {
      icon = <StatusPending />;
      break;
    }
    case ProposalStatus.Queued: {
      icon = <StatusQueued />;
      break;
    }
    case ProposalStatus.Succeeded: {
      icon = <StatusSuccess />;
      break;
    }
  }

  return <StyledIcon size={size}>{icon}</StyledIcon>;
};

const StyledIcon = styled.div<ElementProps>`
  display: flex;
  align-items: center;

  > svg {
    ${(props) => {
      switch (props.size) {
        case ProposalStatusSize.Medium: {
          return `
            height: 1.5rem;
            width: 1.5rem;
          `;
        }
        case ProposalStatusSize.Large: {
          return `
            height: 1.625rem;
            width: 1.625rem;
          `;
        }
      }

      return `
        height: 1.5rem;
        width: 1.5rem;
      `;
    }}
  }
`;

export default ProposalStatusIcon;
