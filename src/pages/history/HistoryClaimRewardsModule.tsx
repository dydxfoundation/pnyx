import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';

import { LocalizationProps, TradingRewardsData } from '@/types';
import { AssetSymbol, DecimalPlaces, DocumentationSublinks, ExternalLink, ModalType } from '@/enums';

import { withLocalization } from '@/hoc';
import { usePollUnclaimedRewards } from '@/hooks';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import { ButtonColor } from '@/components/Button';

import {
  CardContainer,
  SingleStatCard,
  CardSize,
  ValueWithIcon,
  InfoCtaCard,
  CardColor,
} from '@/components/Cards';

import { openModal } from '@/actions/modals';

import { getUnclaimedRewardsData } from '@/selectors/balances';
import { getWalletAddress } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';
import { MustBigNumber } from '@/lib/numbers';

const HistoryClaimRewardsModule: React.FC<
  {
    tradingRewardsData?: TradingRewardsData;
  } & LocalizationProps
> = ({ stringGetter, tradingRewardsData }) => {
  const dispatch = useDispatch();

  const unclaimedRewardsData = useSelector(getUnclaimedRewardsData, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  usePollUnclaimedRewards();

  const { newPendingRootRewards } = tradingRewardsData || {};
  const { unclaimedRewards } = unclaimedRewardsData;

  const unclaimedRewardsBN = MustBigNumber(unclaimedRewards);

  const formattedClaimableAmount = unclaimedRewards ? (
    <ValueWithIcon>
      <NumberFormat
        thousandSeparator
        displayType="text"
        value={unclaimedRewardsBN.toFixed(DecimalPlaces.ShortToken, BigNumber.ROUND_UP)}
      />

      <AssetIcon
        id="history-rewards-module-mobile"
        size={AssetIconSize.Medium}
        symbol={AssetSymbol.DYDX}
      />
    </ValueWithIcon>
  ) : (
    '-'
  );

  const formattedPendingAmount =
    Number(newPendingRootRewards) > 0 ? (
      <ValueWithIcon>
        <NumberFormat
          thousandSeparator
          displayType="text"
          value={MustBigNumber(newPendingRootRewards).toFixed(
            DecimalPlaces.ShortToken,
            BigNumber.ROUND_UP
          )}
        />

        <AssetIcon
          id="history-rewards-module-mobile"
          size={AssetIconSize.Medium}
          symbol={AssetSymbol.DYDX}
        />
      </ValueWithIcon>
    ) : (
      '-'
    );

  return (
    <CardContainer>
      <SingleStatCard
        color={CardColor.Light}
        isLoading={!!walletAddress && !unclaimedRewards}
        label={stringGetter({ key: STRING_KEYS.AVAILABLE_TO_CLAIM_NOW })}
        size={CardSize.Large}
        title={stringGetter({ key: STRING_KEYS.CLAIMABLE })}
        value={formattedClaimableAmount}
      />
      <SingleStatCard
        color={CardColor.Light}
        isLoading={!!walletAddress && newPendingRootRewards === undefined}
        label={stringGetter({ key: STRING_KEYS.IN_PENDING_REWARDS })}
        size={CardSize.Large}
        title={stringGetter({ key: STRING_KEYS.PENDING })}
        value={formattedPendingAmount}
      />
      <InfoCtaCard
        label={stringGetter({ key: STRING_KEYS.CLAIM_REWARDS })}
        body={stringGetter({ key: STRING_KEYS.CLAIM_YOUR_REWARDS_DETAILED_DESCRIPTION })}
        ctaConfigs={{
          primary: {
            color: ButtonColor.Purple,
            label: stringGetter({
              key: walletAddress ? STRING_KEYS.CLAIM_REWARDS : STRING_KEYS.CONNECT_WALLET,
            }),
            onClick: () => {
              dispatch(openModal({ type: walletAddress ? ModalType.Claim : ModalType.Onboarding }));
            },
          },
          secondary: {
            color: ButtonColor.Lighter,
            label: stringGetter({ key: STRING_KEYS.LEARN_MORE }),
            href: `${ExternalLink.Documentation}${DocumentationSublinks.ClaimRewards}`,
            linkOutIcon: true,
          },
        }}
      />
    </CardContainer>
  );
};

export default withLocalization(HistoryClaimRewardsModule);
