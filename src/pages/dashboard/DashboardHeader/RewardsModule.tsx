import React from 'react';
import styled from 'styled-components/macro';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';

import { AppDispatch, RootState } from 'store';
import { LocalizationProps } from 'types';
import { AssetSymbol, DecimalPlaces, ModalType } from 'enums';

import { breakpoints, fontSizes } from 'styles';
import { withLocalization } from 'hoc';
import { usePollUnclaimedRewards } from 'hooks';

import AssetIcon, { AssetIconSize } from 'components/AssetIcon';
import Button from 'components/Button';
import LoadingBar from 'components/LoadingBar';

import { openModal as openModalAction } from 'actions/modals';
import { setUnclaimedRewards as setUnclaimedRewardsAction } from 'actions/balances';

import { getWalletAddress } from 'selectors/wallets';
import { getUnclaimedRewardsData } from 'selectors/balances';

import { STRING_KEYS } from 'constants/localization';
import { MustBigNumber } from 'lib/numbers';

export type RewardsModuleProps = { isMobile: boolean } & LocalizationProps;

export type ConnectedRewardsModule = RewardsModuleProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const RewardsModule: React.FC<ConnectedRewardsModule> = ({
  isMobile,
  openModal,
  setUnclaimedRewards,
  stringGetter,
  unclaimedRewardsData,
  walletAddress,
}) => {
  usePollUnclaimedRewards({
    unclaimedRewardsData,
    setUnclaimedRewards,
    walletAddress: walletAddress as string,
  });

  const { unclaimedRewards } = unclaimedRewardsData;

  return (
    <RewardsSection>
      <RewardsTextContainer>
        <RewardsLabel>
          <GreenPlus>+</GreenPlus>
          {stringGetter({ key: STRING_KEYS.REWARDS })}
        </RewardsLabel>
        <RewardsValue>
          {unclaimedRewards ? (
            <>
              <NumberFormat
                thousandSeparator
                displayType="text"
                value={MustBigNumber(unclaimedRewards).toFixed(
                  DecimalPlaces.ShortToken,
                  BigNumber.ROUND_UP
                )}
              />
              <AssetIcon
                size={isMobile ? AssetIconSize.Medium : AssetIconSize.Tiny}
                symbol={AssetSymbol.DYDX}
              />
            </>
          ) : (
            <LoadingBarContainer>
              <LoadingBar height={isMobile ? 2.125 : 1.375} width={4.5} />
            </LoadingBarContainer>
          )}
        </RewardsValue>
      </RewardsTextContainer>
      <ClaimButton>
        <Button
          disabled={!unclaimedRewards || MustBigNumber(unclaimedRewards).isZero()}
          onClick={() => openModal({ type: ModalType.Claim })}
        >
          {stringGetter({ key: STRING_KEYS.CLAIM })}
        </Button>
      </ClaimButton>
    </RewardsSection>
  );
};

const RewardsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.25rem;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.layerlight};
  margin-top: -0.25rem;
  margin-right: -0.75rem;

  @media ${breakpoints.desktopSmall} {
    flex-direction: column;
    height: min-content;
  }

  @media ${breakpoints.tablet} {
    flex-direction: row;
    margin-right: -0.5rem;
  }

  @media ${breakpoints.mobile} {
    margin-right: 0;
    height: auto;
    padding: 1rem 1.5rem;
  }
`;

const RewardsTextContainer = styled.div`
  padding-right: 1rem;
  margin-top: -0.125rem;

  @media ${breakpoints.desktopSmall} {
    padding-right: 0;
    margin-bottom: 0.75rem;
  }

  @media ${breakpoints.tablet} {
    padding-right: 1.25rem;
    margin-bottom: 0;
    margin-top: -0.25rem;
  }

  @media ${breakpoints.mobile} {
    margin-top: -0.125rem;
  }
`;

const RewardsLabel = styled.div`
  ${fontSizes.size13}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size15}
  }
`;

const GreenPlus = styled.div`
  ${fontSizes.size18}
  color: ${({ theme }) => theme.colorgreen};
  margin-right: 0.25rem;

  @media ${breakpoints.tablet} {
    ${fontSizes.size20}
  }
`;

const RewardsValue = styled.div`
  ${fontSizes.size20}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textlight};

  @media ${breakpoints.tablet} {
    ${fontSizes.size22}
  }

  @media ${breakpoints.mobile} {
    ${fontSizes.size28}
  }

  svg {
    margin-bottom: -0.125rem;
    margin-left: 0.375rem;

    @media ${breakpoints.mobile} {
      margin-bottom: -0.25rem;
    }
  }
`;

const LoadingBarContainer = styled.div`
  margin-top: 0.125rem;

  @media ${breakpoints.mobile} {
    margin-top: 0;
  }
`;

const ClaimButton = styled.div`
  display: flex;
  width: 100%;

  @media ${breakpoints.mobile} {
    width: auto;
  }

  > button {
    flex: 1 1 auto;

    @media ${breakpoints.mobile} {
      flex: 0 0 auto;
    }
  }
`;

const mapStateToProps = (state: RootState) => ({
  unclaimedRewardsData: getUnclaimedRewardsData(state),
  walletAddress: getWalletAddress(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      openModal: openModalAction,
      setUnclaimedRewards: setUnclaimedRewardsAction,
    },
    dispatch
  );

export default withLocalization<RewardsModuleProps>(
  connect(mapStateToProps, mapDispatchToProps)(RewardsModule)
);
