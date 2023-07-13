import React from 'react';
import styled from 'styled-components';

import { AssetSymbol } from '@/enums';
import { DydxDarkIcon, DydxIcon, UsdcIcon } from '@/icons';
import { breakpoints } from '@/styles';

export enum AssetIconSize {
  Tiny = 'Tiny',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
}

type ElementProps = {
  size: AssetIconSize;
};

export type AssetIconProps = {
  dark?: boolean;
  id?: string;
  symbol: AssetSymbol;
} & ElementProps;

const AssetIcon: React.FC<AssetIconProps> = ({ dark, id, size, symbol }) => {
  let icon;
  switch (symbol) {
    case AssetSymbol.DYDX: {
      icon = dark ? <DydxDarkIcon id={id} /> : <DydxIcon id={id} />;
      break;
    }
    case AssetSymbol.USDC: {
      icon = <UsdcIcon id={id} />;
      break;
    }
  }

  return <StyledAssetIcon size={size}>{icon}</StyledAssetIcon>;
};

export default AssetIcon;

const StyledAssetIcon = styled.div<ElementProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    ${(props) => {
      switch (props.size) {
        case AssetIconSize.Tiny: {
          return `
            width: 1.25rem;
            height: 1.25rem;
          `;
        }
        case AssetIconSize.Small: {
          return `
            width: 1.5rem;
            height: 1.5rem;
          `;
        }
        case AssetIconSize.Medium: {
          return `
            width: 1.625rem;
            height: 1.625rem;
          `;
        }
        case AssetIconSize.Large: {
          return `
            width: 2.25rem;
            height: 2.25rem;
          `;
        }
        case AssetIconSize.Huge: {
          return `
            width: 7.5rem;
            height: 7.5rem;

            @media ${breakpoints.desktopSmall} {
              width: 5.5rem;
              height: 5.5rem;
            }

            @media ${breakpoints.mobile} {
              width: 4rem;
              height: 4rem;
            }
          `;
        }
      }

      return `
        width: 2.25rem;
        height: 2.25rem;
      `;
    }}
  }
`;
