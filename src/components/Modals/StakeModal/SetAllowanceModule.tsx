import React, { useState } from 'react';
import styled from 'styled-components';

import { AssetSymbol, StakingPool } from '@/enums';
import { LocalizationProps } from '@/types';

import { withLocalization } from '@/hoc';
import { breakpoints, fontSizes } from '@/styles';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import Button, { ButtonColor } from '@/components/Button';

import { STRING_KEYS } from '@/constants/localization';

import contractClient from '@/lib/contract-client';

export type SetAllowanceModuleProps = {
  assetSymbol: AssetSymbol;
  isWalletIncorrectNetwork: boolean;
  setSentAllowanceTransaction: () => void;
  stakingPool: StakingPool;
  walletAddress: string;
} & LocalizationProps;

const SetAllowanceModule: React.FC<SetAllowanceModuleProps> = ({
  assetSymbol,
  isWalletIncorrectNetwork,
  setSentAllowanceTransaction,
  stakingPool,
  stringGetter,
  walletAddress,
}) => {
  const [isSettingAllowance, setIsSettingAllowance] = useState<boolean>(false);

  const onClickSetAllowance = async () => {
    try {
      setIsSettingAllowance(true);
      await contractClient.stakingPoolClient?.setAllowance({ stakingPool, walletAddress });
      setSentAllowanceTransaction();
    } catch (error) {
      console.error(error);
      setIsSettingAllowance(false);
    }
  };

  return (
    <StyledSetAllowanceModule>
      <Title>
        {stringGetter({ key: STRING_KEYS.ENABLE_SYMBOL, params: { SYMBOL: assetSymbol } })}
      </Title>
      <Body>
        {stringGetter({
          key: STRING_KEYS.SET_ALLOWANCE_EXPLANATION,
          params: { SYMBOL: assetSymbol },
        })}
      </Body>
      <Button
        fullWidth
        color={ButtonColor.Lighter}
        onClick={onClickSetAllowance}
        isLoading={isSettingAllowance}
        disabled={isWalletIncorrectNetwork}
      >
        <ButtonIcon>
          <AssetIcon dark symbol={assetSymbol} size={AssetIconSize.Small} />
        </ButtonIcon>
        {stringGetter({
          key: STRING_KEYS.ENABLE_SYMBOL,
          params: { SYMBOL: assetSymbol },
        })}
      </Button>
    </StyledSetAllowanceModule>
  );
};

const StyledSetAllowanceModule = styled.div`
  background-color: ${({ theme }) => theme.layerdark};
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin: 0.75rem 0;

  @media ${breakpoints.tablet} {
    padding: 1rem;
  }
`;

const Title = styled.div`
  ${fontSizes.size16}
  color: ${({ theme }) => theme.textlight};

  @media ${breakpoints.tablet} {
    ${fontSizes.size18}
  }
`;

const ButtonIcon = styled.div`
  margin: 0.125rem 0.5rem 0 -0.5rem;
`;

const Body = styled.div`
  ${fontSizes.size15}
  margin: 0.25rem 0 0.75rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
    margin: 0.375rem 0 1rem;
  }
`;

export default withLocalization(SetAllowanceModule);
