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

import { STRING_KEYS } from 'constants/localization';
import { MustBigNumber } from 'lib/numbers';

export type HistoryClaimRewardsModuleProps = {} & LocalizationProps;

const HistoryClaimRewardsModule: React.FC<HistoryClaimRewardsModuleProps> = ({ stringGetter }) => {
  const dispatch = useDispatch();

  const unclaimedRewardsData = useSelector(getUnclaimedRewardsData, shallowEqual);

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
        <StyledCopySection>
          <StyledTitle>{stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}</StyledTitle>
          <StyledBody>
            {stringGetter({ key: STRING_KEYS.CLAIM_YOUR_REWARDS_DETAILED_DESCRIPTION })}
          </StyledBody>
        </StyledCopySection>
        <StyledRewardsButtonContainer>
          <StyledClaimableRewards>
            <StyledClaimableLabel>
              {stringGetter({ key: STRING_KEYS.CLAIMABLE })}
              <StyledClaimableSublabel>
                {stringGetter({ key: STRING_KEYS.STAKING_TRADING_REWARDS })}
              </StyledClaimableSublabel>
            </StyledClaimableLabel>
            <StyledformattedClaimableAmount>
              <NumberFormat thousandSeparator displayType="text" value={formattedClaimableAmount} />
              <AssetIcon
                id="history-rewards-module"
                size={AssetIconSize.Medium}
                symbol={AssetSymbol.DYDX}
              />
            </StyledformattedClaimableAmount>
          </StyledClaimableRewards>
          <StyledButtonSection>
            <Button
              onClick={() => {
                dispatch(openModal({ type: ModalType.Claim }));
              }}
            >
              {stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}
            </Button>
            <Button
              color={ButtonColor.Lighter}
              href={`${ExternalLink.Documentation}${DocumentationSublinks.ClaimRewards}`}
            >
              {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
            </Button>
          </StyledButtonSection>
        </StyledRewardsButtonContainer>
      </Styled.HistoryClaimRewardsModule>
    </Styled.ModuleContainer>
  );
};

const Styled = {
  ModuleContainer: styled.div`
    display: grid;
    grid-gap: 1rem;

    @media ${breakpoints.tablet} {
      margin-top: -3rem;
    }
  `,
  HistoryClaimRewardsModule: styled.div`
    display: flex;
    background-color: ${({ theme }) => theme.layerlight};
    width: 100%;
    padding: 1.25rem 1.5rem;
    border-radius: 1rem;

    @media ${breakpoints.tablet} {
      flex-direction: column;
    }
  `,
};

const StyledCopySection = styled.div`
  flex: 1 1 auto;
`;

const StyledTitle = styled.div`
  ${fontSizes.size20};
  color: ${({ theme }) => theme.textlight};
`;

const StyledBody = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textdark};
  margin-top: 0.5rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

const StyledRewardsButtonContainer = styled.div`
  display: flex;
  margin-left: 1.5rem;

  @media ${breakpoints.tablet} {
    margin-left: 0;
    margin-top: 1rem;
  }

  @media ${breakpoints.mobile} {
    flex-direction: column;
    margin-top: 0;
  }
`;

const StyledClaimableRewards = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.layerdark};
  padding: 1.25rem;
  margin-right: 1rem;
  border-radius: 0.75rem;
  min-width: max-content;
  flex: 1 1 auto;

  @media ${breakpoints.mobile} {
    display: none;
  }
`;

const StyledClaimableLabel = styled.div`
  ${fontSizes.size15};
  color: ${({ theme }) => theme.textbase};
  min-width: 8rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size16};
  }
`;

const StyledClaimableSublabel = styled.div`
  ${fontSizes.size14};
  color: ${({ theme }) => theme.textdark};
`;

const StyledformattedClaimableAmount = styled.div`
  ${fontSizes.size24}
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.textlight};
  padding-left: 1.5rem;
  min-width: 8rem;

  @media ${breakpoints.mobile} {
    min-width: auto;
    padding-left: 0;
    margin-top: 0.5rem;
  }

  svg {
    margin-left: 0.375rem;
  }
`;

const StyledButtonSection = styled.div`
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
