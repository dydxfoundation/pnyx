import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallowEqual, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { TradingRewardStatus } from 'enums';
import { LocalizationProps, TradingRewardsData } from 'types';

import { withLocalization } from 'hoc';
import { useGetTradingRewardsData } from 'hooks';
import { StatusExecutedIcon, StatusPendingIcon } from 'icons';

import { CellAlign, SortableTable, TableCell } from 'components/SortableTable';

import { getSelectedLocale } from 'selectors/localization';

import { STRING_KEYS } from 'constants/localization';

export type TradingRewardsHistoryTableProps = {} & LocalizationProps;

const getFormattedTableData = ({
  tradingRewardsData,
}: {
  tradingRewardsData?: TradingRewardsData;
}) => {
  if (!tradingRewardsData) {
    return [];
  }

  const {
    epochData: { currentEpoch, epochLength, endOfEpochTimestamp, waitingPeriodLength },
    newPendingRootRewards,
    pendingRootData,
    rewardsPerEpoch,
  } = tradingRewardsData;

  const formattedData = [];

  if (pendingRootData.hasPendingRoot) {
    if (parseFloat(newPendingRootRewards) > 0) {
      formattedData.push({
        amount: newPendingRootRewards,
        epochEnd: endOfEpochTimestamp - waitingPeriodLength,
        epochNumber: currentEpoch,
        status: TradingRewardStatus.Pending,
      });
    }
  }

  for (let i = currentEpoch; i >= 0; i--) {
    if (rewardsPerEpoch[i]) {
      formattedData.push({
        amount: rewardsPerEpoch[i],
        epochEnd: endOfEpochTimestamp - (currentEpoch - i) * epochLength,
        epochNumber: i,
        status: TradingRewardStatus.Granted,
      });
    }
  }

  return formattedData;
};

const TradingRewardsHistoryTable: React.FC<TradingRewardsHistoryTableProps> = ({
  stringGetter,
}) => {
  const selectedLocale = useSelector(getSelectedLocale, shallowEqual);

  const tradingRewardsData = useGetTradingRewardsData();
  const formattedData = getFormattedTableData({ tradingRewardsData });

  console.log('tradingRewardsData', tradingRewardsData);
  return (
    <SortableTable
      data={formattedData}
      columns={[
        {
          key: 'epochEnd',
          label: stringGetter({ key: STRING_KEYS.STATUS }),
          renderCell: ({ rowData: { status, epochEnd } }) => {
            const epochEndDate = new Date(epochEnd * 1000);

            const DateFormat = new Intl.DateTimeFormat(selectedLocale, {
              month: 'short',
              day: '2-digit',
            });

            const TimeFormat = new Intl.DateTimeFormat(selectedLocale, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <Styled.StatusCell>
                {status === TradingRewardStatus.Pending ? (
                  <StatusPendingIcon />
                ) : (
                  <StatusExecutedIcon />
                )}
                {DateFormat.format(epochEndDate)}
                {TimeFormat.format(epochEndDate)}
              </Styled.StatusCell>
            );
          },
        },
        {
          key: 'event',
          fillWidth: true,
          label: stringGetter({ key: STRING_KEYS.EVENT }),
          renderCell: ({ rowData: { epochNumber } }) => (
            <Styled.StatusCell>
              {stringGetter({ key: STRING_KEYS.REWARDED })}
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
            </Styled.StatusCell>
          ),
        },
        {
          key: 'amount',
          align: CellAlign.End,
          label: stringGetter({ key: STRING_KEYS.EARNED }),
          renderCell: ({ rowData: { amount } }) => (
            <Styled.StatusCell align={CellAlign.End}>{amount}</Styled.StatusCell>
          ),
        },
      ]}
      getRowKey={({ rowData }) => rowData.epochEnd}
    />
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.StatusCell = styled(TableCell)``;

Styled.WithBaseSpan = styled.div`
  > span {
    color: ${({ theme }) => theme.textbase};
  }
`;

export default withLocalization(TradingRewardsHistoryTable);
