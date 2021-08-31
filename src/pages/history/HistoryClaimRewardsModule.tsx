import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';

import { LocalizationProps } from 'types';
import { AssetSymbol, DecimalPlaces, DocumentationSublinks, ExternalLink, ModalType } from 'enums';

import { withLocalization } from 'hoc';
import { usePollUnclaimedRewards } from 'hooks';
import { breakpoints, fontSizes, MobileOnly } from 'styles';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import Button, { ButtonColor } from 'components/Button';
import { SingleStatCard, CardSize, ValueWithIcon } from 'components/Cards';

import { openModal } from 'actions/modals';

import { getUnclaimedRewardsData } from 'selectors/balances';
import { getWalletAddress } from 'selectors/wallets';

import { STRING_KEYS } from 'constants/localization';
import { MustBigNumber } from 'lib/numbers';

export type HistoryClaimRewardsModuleProps = {} & LocalizationProps;

const HistoryClaimRewardsModule: React.FC<HistoryClaimRewardsModuleProps> = ({ stringGetter }) => {
  const dispatch = useDispatch();

  const unclaimedRewardsData = useSelector(getUnclaimedRewardsData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  usePollUnclaimedRewards();

  const { unclaimedRewards } = unclaimedRewardsData;

  const formattedClaimableAmount = MustBigNumber(unclaimedRewards).toFixed(
    DecimalPlaces.ShortToken,
    BigNumber.ROUND_UP
  );

  return (
    <Styled.ModuleContainer>
      <MobileOnly>
        <SingleStatCard
          size={CardSize.Large}
          title={stringGetter({ key: STRING_KEYS.CLAIMABLE })}
          value={
            <ValueWithIcon>
              {formattedClaimableAmount}
              <AssetIcon
                id="history-rewards-module-mobile"
                size={AssetIconSize.Medium}
                symbol={AssetSymbol.DYDX}
              />
            </ValueWithIcon>
          }
          label={stringGetter({ key: STRING_KEYS.STAKING_TRADING_REWARDS })}
        />
      </MobileOnly>
      <Styled.HistoryClaimRewardsModule>
        <Styled.CopySection>
          <Styled.Title>{stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}</Styled.Title>
          <Styled.Body>
            {stringGetter({ key: STRING_KEYS.CLAIM_YOUR_REWARDS_DETAILED_DESCRIPTION })}
          </Styled.Body>
        </Styled.CopySection>
        <Styled.RewardsButtonContainer>
          <Styled.ClaimableRewards>
            <Styled.ClaimableLabel>
              {stringGetter({ key: STRING_KEYS.CLAIMABLE })}
            </Styled.ClaimableLabel>
            <Styled.ClaimableAmount>
              <NumberFormat thousandSeparator displayType="text" value={formattedClaimableAmount} />
              <AssetIcon
                id="history-rewards-module"
                size={AssetIconSize.Medium}
                symbol={AssetSymbol.DYDX}
              />
            </Styled.ClaimableAmount>
          </Styled.ClaimableRewards>
          <Styled.ButtonSection>
            <Button
              onClick={() => {
                dispatch(
                  openModal({ type: walletAddress ? ModalType.Claim : ModalType.Onboarding })
                );
              }}
            >
              {stringGetter({
                key: walletAddress ? STRING_KEYS.CLAIM_REWARDS : STRING_KEYS.CONNECT_WALLET,
              })}
            </Button>
            <Button
              linkOutIcon
              color={ButtonColor.Lighter}
              href={`${ExternalLink.Documentation}${DocumentationSublinks.ClaimRewards}`}
            >
              {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
            </Button>
          </Styled.ButtonSection>
        </Styled.RewardsButtonContainer>
      </Styled.HistoryClaimRewardsModule>
    </Styled.ModuleContainer>
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.ModuleContainer = styled.div`
  display: grid;
  grid-gap: 1rem;

  @media ${breakpoints.tablet} {
    margin-top: -3rem;
  }
`;

Styled.HistoryClaimRewardsModule = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.layerlight};
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 2rem;
  border-radius: 1rem;

  @media ${breakpoints.tablet} {
    flex-direction: column;
    padding: 1.25rem 1.5rem;
  }
`;

Styled.CopySection = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
`;

Styled.Title = styled.div`
  ${fontSizes.size20};
  color: ${({ theme }) => theme.textlight};
`;

Styled.Body = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.5rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

Styled.RewardsButtonContainer = styled.div`
  display: flex;
  margin-left: 2rem;

  @media ${breakpoints.tablet} {
    margin-left: 0;
    margin-top: 1rem;
  }

  @media ${breakpoints.mobile} {
    flex-direction: column;
    margin-top: 0;
  }
`;

Styled.ClaimableRewards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.layerdark};
  padding: 1.25rem;
  margin-right: 1rem;
  border-radius: 0.75rem;
  min-width: 16rem;
  flex: 1 1 auto;

  @media ${breakpoints.mobile} {
    display: none;
  }
`;

Styled.ClaimableLabel = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textbase};
  min-width: 8rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

Styled.ClaimableAmount = styled.div`
  ${fontSizes.size24}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textlight};
  min-width: 8rem;
  margin-top: 0.75rem;

  @media ${breakpoints.mobile} {
    min-width: auto;
    padding-left: 0;
  }

  svg {
    margin-left: 0.375rem;
  }
`;

Styled.ButtonSection = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 0.5rem;
  flex: 0 1 auto;

  @media ${breakpoints.mobile} {
    margin-top: 1rem;
    grid-gap: 0.75rem;
  }

  > * {
    min-width: max-content;
  }
`;

export default withLocalization(HistoryClaimRewardsModule);
