import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';

import {
  AssetSymbol,
  DecimalPlaces,
  DocumentationSublinks,
  ExternalLink,
  ModalType,
  TradingRewardStatus,
} from '@/enums';

import { LocalizationProps, TradingRewardsData } from '@/types';

import { withLocalization } from '@/hoc';
import { StatusActiveIcon, StatusExecutedIcon } from '@/icons';
import { breakpoints, fontSizes, MobileOnly, NotMobileOnly } from '@/styles';

import AssetIcon, { AssetIconSize } from '@/components/AssetIcon';
import Button, { ButtonColor, ButtonContainer } from '@/components/Button';
import { CellAlign, SortableTable, TableCell } from '@/components/SortableTable';

import { openModal } from '@/actions/modals';

import { getSelectedLocale } from '@/selectors/localization';
import { getWalletAddress } from '@/selectors/wallets';

import { STRING_KEYS } from '@/constants/localization';

import { MustBigNumber } from '@/lib/numbers';

const getFormattedTableData = ({
  tradingRewardsData,
}: {
  tradingRewardsData?: TradingRewardsData;
}) => {
  if (!tradingRewardsData) {
    return [];
  }

  const {
    epochData: { currentEpoch, epochLength, endOfEpochTimestamp },
    newPendingRootRewards,
    pendingRootData,
    rewardsPerEpoch,
  } = tradingRewardsData;

  const formattedData = [];

  if (pendingRootData.hasPendingRoot) {
    if (parseFloat(newPendingRootRewards) > 0) {
      formattedData.push({
        amount: newPendingRootRewards,
        epochEnd: endOfEpochTimestamp - epochLength,
        epochNumber: currentEpoch - 1,
        status: TradingRewardStatus.Pending,
      });
    }
  }

  for (let i = currentEpoch; i >= 0; i--) {
    if (rewardsPerEpoch[i]) {
      let rewardAmount = MustBigNumber(rewardsPerEpoch[i]);

      if (i > 0) {
        const lastEpochRewards = tradingRewardsData?.rewardsPerEpoch?.[i - 1];

        if (lastEpochRewards) {
          rewardAmount = rewardAmount.minus(lastEpochRewards);
        }
      }

      formattedData.push({
        amount: rewardAmount,
        epochEnd: endOfEpochTimestamp - (currentEpoch - i) * epochLength,
        epochNumber: i,
        status: TradingRewardStatus.Granted,
      });
    }
  }

  return formattedData;
};

const TradingRewardsHistoryTable: React.FC<
  {
    tradingRewardsData?: TradingRewardsData;
  } & LocalizationProps
> = ({ stringGetter, tradingRewardsData }) => {
  const dispatch = useDispatch();

  const selectedLocale = useSelector(getSelectedLocale, shallowEqual);
  const walletAddress = useSelector(getWalletAddress);

  const formattedData = getFormattedTableData({ tradingRewardsData });

  return (
    <SortableTable
      columns={[
        {
          key: 'epochEnd',
          label: stringGetter({ key: STRING_KEYS.STATUS }),
          renderHeaderCell: ({ key, label }) => (
            <Styled.StatusHeaderCell key={key}>{label}</Styled.StatusHeaderCell>
          ),
          renderCell: ({ rowData: { status, epochEnd } }) => {
            const epochEndDate = new Date(epochEnd * 1000);

            const DateFormat = new Intl.DateTimeFormat(selectedLocale, {
              month: 'short',
              day: '2-digit',
            });

            const TimeFormat = new Intl.DateTimeFormat(selectedLocale, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Styled.StatusCell>
                {status === TradingRewardStatus.Pending ? (
                  <StatusActiveIcon />
                ) : (
                  <StatusExecutedIcon />
                )}
                <Styled.StatusCellDate>
                  <div>{DateFormat.format(epochEndDate)}</div>
                  <div>{TimeFormat.format(epochEndDate)}</div>
                </Styled.StatusCellDate>
              </Styled.StatusCell>
            );
          },
        },
        {
          key: 'event',
          fillWidth: true,
          label: stringGetter({ key: STRING_KEYS.EVENT }),
          renderCell: ({ rowData: { epochNumber, status } }) => (
            <Styled.EventCell>
              <div>
                {stringGetter({
                  key:
                    status === TradingRewardStatus.Pending
                      ? STRING_KEYS.PENDING_REWARDS
                      : STRING_KEYS.REWARDED,
                })}
              </div>
              <MobileOnly>
                {stringGetter({
                  key: STRING_KEYS.EPOCH_NUMBER,
                  params: { NUMBER: epochNumber },
                })}
              </MobileOnly>
              <NotMobileOnly>
                <Styled.WithBaseSpan
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: stringGetter({
                      key: STRING_KEYS.FOR_TRADING_IN_EPOCH,
                      params: {
                        EPOCH_NUMBER: ReactDOMServer.renderToString(
                          <span>
                            {stringGetter({
                              key: STRING_KEYS.EPOCH_NUMBER,
                              params: { NUMBER: epochNumber },
                            })}
                          </span>
                        ),
                      },
                    }),
                  }}
                />
              </NotMobileOnly>
            </Styled.EventCell>
          ),
        },
        {
          key: 'amount',
          align: CellAlign.End,
          label: stringGetter({ key: STRING_KEYS.EARNED }),
          renderCell: ({ rowData: { amount, epochNumber } }) => (
            <Styled.EarnedCell align={CellAlign.End}>
              <NumberFormat
                thousandSeparator
                displayType="text"
                value={MustBigNumber(amount).toFixed(DecimalPlaces.ShortToken)}
              />
              <AssetIcon size={AssetIconSize.Medium} symbol={AssetSymbol.DYDX} />
            </Styled.EarnedCell>
          ),
        },
      ]}
      data={formattedData}
      emptyState={
        <Styled.EmptyState>
          {stringGetter({ key: STRING_KEYS.TRADING_REWARDS_HISTORY_EMPTY_STATE })}
          {walletAddress && (
            <ButtonContainer>
              <Button
                linkOutIcon
                onClick={() => dispatch(openModal({ type: ModalType.TradeLink }))}
              >
                {stringGetter({ key: STRING_KEYS.TRADE })}
              </Button>
              <Button
                linkOutIcon
                color={ButtonColor.Lighter}
                href={`${ExternalLink.Documentation}${DocumentationSublinks.TradingRewards}`}
              >
                {stringGetter({ key: STRING_KEYS.LEARN_MORE })}
              </Button>
            </ButtonContainer>
          )}
        </Styled.EmptyState>
      }
      getRowKey={({ rowData }) => rowData.epochEnd}
      isLoading={!!walletAddress && !tradingRewardsData}
    />
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.EmptyState = styled.div`
  ${fontSizes.size17}
  width: 100%;
  border-top: solid 0.0625rem ${({ theme }) => theme.bordergrey};
  padding: 1.5rem 0;
`;

Styled.StatusHeaderCell = styled(TableCell)`
  min-width: 8.875rem;

  @media ${breakpoints.mobile} {
    min-width: 6rem;
  }
`;

Styled.StatusCell = styled(TableCell)`
  > svg {
    margin-right: 1.5rem;

    @media ${breakpoints.mobile} {
      margin-right: 0.75rem;
    }
  }
`;

Styled.StatusCellDate = styled.div`
  ${fontSizes.size17}
  display: grid;
  gap: 0.25rem;
  color: ${({ theme }) => theme.textbase};
  padding-right: 2rem;

  @media ${breakpoints.mobile} {
    padding-right: 1rem;
  }

  > div:last-child {
    ${fontSizes.size16}
    white-space: nowrap;
    color: ${({ theme }) => theme.textdark};
  }
`;

Styled.EventCell = styled(TableCell)`
  ${fontSizes.size17}
  display: grid;
  grid-auto-flow: row;
  gap: 0.25rem;
  color: ${({ theme }) => theme.textlight};
  padding-right: 1.5rem;

  @media ${breakpoints.mobile} {
    padding-right: 1rem;
  }

  > div:not(:first-child) {
    ${fontSizes.size16}
    white-space: nowrap;
    color: ${({ theme }) => theme.textdark};
  }
`;

Styled.EarnedCell = styled(TableCell)`
  ${fontSizes.size18}

  > div {
    margin-left: 0.375rem;
  }
`;

Styled.WithBaseSpan = styled.div`
  > span {
    color: ${({ theme }) => theme.textbase};
  }
`;

export default withLocalization(TradingRewardsHistoryTable);
