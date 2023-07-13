import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { ArrowDownIcon } from '@/icons';
import { breakpoints, fonts, fontSizes } from '@/styles';

import LoadingBar from '@/components/LoadingBar';

export enum SortType {
  String = 'String',
  Number = 'Number',
}

export enum SortDirection {
  Increasing = 'Increasing',
  Decreasing = 'Decreasing',
}

export enum CellAlign {
  Center = 'Center',
  End = 'End',
  Start = 'Start',
}

type SortByColumnConfig = {
  key: string;
  sortDirection: SortDirection;
};

type RowData = {
  // eslint-disable-next-line
  [key: string]: any;
};

type BasicCellProps = {
  align?: CellAlign;
  fillWidth?: boolean;
  isSortable?: boolean;
  key: string;
  label: React.ReactNode;
  sortDirection?: SortDirection;
};

type RenderHeaderCellProps = {
  isSorted: boolean;
  onClick?: () => void;
} & BasicCellProps;

type RenderCellProps = {
  align?: CellAlign;
  rowData: RowData;
  rowIndex: number;
};

type RenderCellFunction = (props: RenderCellProps) => React.ReactNode;
type RenderHeaderCellFunction = (props: RenderHeaderCellProps) => React.ReactNode;

type ColumnConfig = {
  renderCell: RenderCellFunction;
  renderHeaderCell?: RenderHeaderCellFunction;
  sort?: (row1: RowData, row2: RowData) => number;
  sortType?: SortType;
} & BasicCellProps;

type SortableTableProps = {
  columns: ColumnConfig[];
  data: RowData[];
  defaultSortByColumn?: SortByColumnConfig;
  emptyState?: React.ReactNode;
  // eslint-disable-next-line
  getRowKey: (args: { rowData: any }) => string;
  isLoading: boolean;
};

const renderDefaultHeaderCell: React.FC<RenderHeaderCellProps> = ({
  align,
  isSortable,
  isSorted,
  key,
  label,
  onClick,
  sortDirection,
}) => {
  const commonProps = {
    align,
    key,
  };

  return isSortable ? (
    <Styled.TableCellWithSortToggle
      role="button"
      tabIndex="0"
      isSorted={isSorted}
      onClick={onClick}
      {...commonProps}
    >
      <span>{label}</span>
      <Styled.SortDirectionArrow sortDirection={sortDirection} />
    </Styled.TableCellWithSortToggle>
  ) : (
    <Styled.TableCell {...commonProps}>{label}</Styled.TableCell>
  );
};

export const SortableTable: React.FC<SortableTableProps> = ({
  columns = [],
  data = [],
  defaultSortByColumn,
  emptyState,
  getRowKey,
  isLoading,
}) => {
  const initialSortByColumn: SortByColumnConfig = {
    key: defaultSortByColumn?.key ?? columns[0].key,
    sortDirection: defaultSortByColumn?.sortDirection ?? SortDirection.Decreasing,
  };

  const [sortByColumn, setSortByColumn] = useState<SortByColumnConfig>(initialSortByColumn);

  const onToggleSortByColumn = (columnKey: string) => {
    if (columnKey !== sortByColumn.key) {
      setSortByColumn({
        key: columnKey,
        sortDirection: SortDirection.Increasing,
      });
    } else if (sortByColumn.sortDirection === SortDirection.Increasing) {
      setSortByColumn({
        key: columnKey,
        sortDirection: SortDirection.Decreasing,
      });
    } else if (sortByColumn.sortDirection === SortDirection.Decreasing) {
      setSortByColumn(initialSortByColumn);
    }
  };

  const sortFunction = (row1: RowData, row2: RowData) => {
    const { key: columnKey, sortDirection } = sortByColumn;

    const {
      sortType = SortType.String,
      sort = (_row1: RowData, _row2: RowData) => {
        const value1 = _row1[columnKey];
        const value2 = _row2[columnKey];

        return sortType === SortType.String
          ? String(value1).localeCompare(String(value2)) < 0
          : parseFloat(value1) < parseFloat(value2);
      },
    } = columns.find(({ key }) => columnKey === key) || {};

    return sort(row1, row2) === (sortDirection === SortDirection.Increasing) ? -1 : 1;
  };

  const hasData = data?.length > 0;

  return (
    <Styled.TableWrapper>
      <Styled.Table>
        <Styled.Thead>
          <Styled.Tr>
            {columns.map(
              ({
                align,
                fillWidth = false,
                isSortable = false,
                key,
                label,
                renderHeaderCell = renderDefaultHeaderCell,
              }) => (
                <Styled.Th key={key} align={align} fillWidth={fillWidth}>
                  {renderHeaderCell({
                    align,
                    isSortable,
                    isSorted: sortByColumn.key === key,
                    key,
                    label,
                    onClick: isSortable ? () => onToggleSortByColumn(key) : undefined,
                    sortDirection:
                      sortByColumn.key === key ? sortByColumn.sortDirection : undefined,
                  })}
                </Styled.Th>
              )
            )}
          </Styled.Tr>
        </Styled.Thead>
        {!isLoading && hasData && (
          <tbody>
            {data.sort(sortFunction).map((rowData, rowIndex) => (
              <Styled.Tr key={getRowKey({ rowData })}>
                {columns.map(({ key: columnKey, align, renderCell }) => (
                  <Styled.Td key={columnKey}>
                    {renderCell({
                      align,
                      rowData,
                      rowIndex,
                    })}
                  </Styled.Td>
                ))}
              </Styled.Tr>
            ))}
          </tbody>
        )}
      </Styled.Table>
      {isLoading && (
        <Styled.LoadingBarContainer>
          <LoadingBar fullWidth height={4} />
          <LoadingBar fullWidth height={4} />
          <LoadingBar fullWidth height={4} />
        </Styled.LoadingBarContainer>
      )}
      {!isLoading && !hasData && emptyState}
    </Styled.TableWrapper>
  );
};

// eslint-disable-next-line
const Styled: any = {};

Styled.TableWrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  align-content: start;
  place-items: center;
  max-width: 100%;

  @media ${breakpoints.tablet} {
    padding: 0 0.25rem;
  }
`;

Styled.Table = styled.table`
  ${fontSizes.size15}
  border: none;
  width: 100%;
  border-collapse: collapse;
`;

Styled.Thead = styled.thead`
  position: sticky;
  top: 0;
  letter-spacing: 0;
  color: ${({ theme }) => theme.textdark};

  @media ${breakpoints.tablet} {
    ${fontSizes.size16}
  }

  > tr {
    border-top: none;
  }
`;

Styled.Tr = styled.tr`
  border-top: solid 0.0625rem ${({ theme }) => theme.bordergrey};
`;

Styled.Th = styled.th<{ fillWidth?: boolean }>`
  vertical-align: middle;
  text-align: inherit;
  white-space: nowrap;

  ${({ fillWidth }) =>
    fillWidth &&
    css`
      width: 100%;
    `}
`;

Styled.Td = styled.td`
  vertical-align: middle;
`;

export const TableCell = styled.div<{ align?: CellAlign }>`
  display: grid;
  grid-auto-flow: column;
  align-items: center;

  text-align: ${({ align }) =>
    ({ [CellAlign.Start]: 'left', [CellAlign.Center]: 'center', [CellAlign.End]: 'right' }[
      align ?? CellAlign.Start
    ])};

  justify-content: ${({ align }) =>
    ({ [CellAlign.Start]: 'start', [CellAlign.Center]: 'center', [CellAlign.End]: 'end' }[
      align ?? CellAlign.Start
    ])};

  ${Styled.Th} & {
    ${fonts.medium}
    padding: 1.5rem 0 1.25rem;
  }

  ${Styled.Td} & {
    padding: 0.75rem 0;
  }
`;

Styled.TableCell = TableCell;

Styled.TableCellWithSortToggle = styled(Styled.TableCell)`
  cursor: pointer;
  transition: color 0.15s;

  gap: 0.33em;

  ${({ align }) =>
    align === 'end' &&
    css`
      // Reverse order
      & > :first-child {
        order: 2;
      }
    `}

  @media ${breakpoints.notTablet} {
    &:hover {
      color: var(--color-text-light);
    }
  }
  ${({ isSorted }) =>
    isSorted &&
    css`
      color: var(--color-text-light);
    `}
`;

Styled.SortDirectionArrow = styled(ArrowDownIcon)<{ sortDirection: SortDirection }>`
  transform: perspective(0.625rem) scale(0.00001);
  width: 0.625rem;

  transition: transform 0.25s cubic-bezier(0.33, 1.55, 0.25, 1), font-size 0.12s ease-out,
    opacity 0.15s;

  ${({ sortDirection }) =>
    ({
      [SortDirection.Increasing]: css`
        transform: perspective(0.625rem) rotateX(180deg);
      `,
      [SortDirection.Decreasing]: css`
        transform: perspective(0.625rem) rotateX(0);
      `,
    }[sortDirection])}
`;

Styled.LoadingBarContainer = styled.div`
  display: grid;
  gap: 0.5rem;
  width: 100%;
`;
