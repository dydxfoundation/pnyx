import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { css } from 'styled-components';

import { AppDispatch } from '@/store';
import { WalletType } from '@/enums';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { CopyIcon, DisconnectIcon } from '@/icons';

import { disconnectWallet as disconnectWalletAction } from '@/actions/wallets';
import { STRING_KEYS } from '@/constants/localization';

import { HeaderMenu, MenuOption } from './HeaderMenuStyles';

export type WalletMenuProps = {
  closeMenu: () => void;
  walletAddress: string;
  walletType: WalletType;
} & LocalizationProps;

const WalletMenu = React.forwardRef<
  HTMLDivElement,
  WalletMenuProps & ReturnType<typeof mapDispatchToProps> & React.HTMLAttributes<HTMLDivElement>
>(({ closeMenu, disconnectWallet, stringGetter, walletAddress, walletType }, ref) => (
  <StyledWalletMenu ref={ref}>
    <OptionWithIcon
      onClick={() => {
        if (window.navigator && window.navigator.clipboard) {
          navigator.clipboard.writeText(walletAddress);
        }

        closeMenu();
      }}
    >
      <CopyIcon />
      {stringGetter({ key: STRING_KEYS.COPY_ADDRESS })}
    </OptionWithIcon>
    <DisconnectOption
      onClick={() => {
        disconnectWallet({ walletType });
        closeMenu();
      }}
    >
      <DisconnectIcon />
      {stringGetter({ key: STRING_KEYS.DISCONNECT })}
    </DisconnectOption>
  </StyledWalletMenu>
));

const iconStyles = css`
  margin-top: 0.0625rem;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const StyledWalletMenu = styled(HeaderMenu)`
  top: 3rem;
`;

const OptionWithIcon = styled(MenuOption)`
  white-space: nowrap;

  > svg {
    ${iconStyles};

    path {
      stroke: ${({ theme }) => theme.textbase};
    }
  }

  &:hover {
    > svg path {
      stroke: ${({ theme }) => theme.textlight};
    }
  }
`;

const DisconnectOption = styled(MenuOption)`
  color: ${({ theme }) => theme.colorred};

  > svg {
    ${iconStyles};
  }

  &:hover {
    color: ${({ theme }) => theme.colorred};
  }
`;

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      disconnectWallet: disconnectWalletAction,
    },
    dispatch
  );

export default withLocalization<WalletMenuProps>(
  connect(null, mapDispatchToProps, null, { forwardRef: true })(WalletMenu)
);
