'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { BackendOrder, OrderFilter } from '@/types/api/order';
import type { FilterOption, OrderSortKey } from '@/features/admin/hooks/useAdminOrders';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import OrdersTableHead from '@/components/OrdersTable/OrdersTableHead/OrdersTableHead';
import OrdersTableBody from '@/components/OrdersTable/OrdersTableBody/OrdersTableBody';
import { OrdersFilterBar } from '@/components/OrdersTable/OrdersFilterBar/OrdersFilterBar';
import { OrdersRevenueCard } from '@/components/OrdersTable/OrdersRevenueCard/OrdersRevenueCard';
import { OrderDetailDialog } from '@/components/OrdersTable/OrderDetailDialog/OrderDetailDialog';
import styles from './OrdersTableComposed.module.scss';

interface OrdersTableComposedProps {
  readonly orders: BackendOrder[];
  readonly total: number;
  readonly totalRevenue: number;
  readonly grandTotalRevenue: number;
  readonly page: number;
  readonly filter: OrderFilter;
  readonly filterOptions: FilterOption[];
  readonly selected: BackendOrder | null;
  readonly isPending: boolean;
  readonly locale: Locale;
  readonly sortKey: OrderSortKey | null;
  readonly sortDir: 'asc' | 'desc';
  readonly setSelected: (order: BackendOrder | null) => void;
  readonly handleFilterChange: (e: React.MouseEvent, value: OrderFilter | null) => void;
  readonly handlePageChange: (e: React.MouseEvent | null, newPage: number) => void;
  readonly handleSort: (key: OrderSortKey) => void;
}

export default function OrdersTableComposed({
  orders,
  total,
  totalRevenue,
  grandTotalRevenue,
  page,
  filter,
  filterOptions,
  selected,
  isPending,
  locale,
  sortKey,
  sortDir,
  setSelected,
  handleFilterChange,
  handlePageChange,
  handleSort,
}: Readonly<OrdersTableComposedProps>) {
  const t = createTranslator(locale);

  return (
    <>
      <Box>
        <Typography variant="h5" className={styles.title}>
          {t('ordersTableTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('ordersTableSubtitle')}
        </Typography>
      </Box>

      <OrdersFilterBar
        filter={filter}
        filterOptions={filterOptions}
        isPending={isPending}
        onChange={handleFilterChange}
      />

      <TableContainer
        component={Paper}
        variant="outlined"
        className={clsx(styles.tableWrap, isPending && styles.pending)}
      >
        <Table size="small">
          <OrdersTableHead
            locale={locale}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <OrdersTableBody orders={orders} onRowClick={setSelected} locale={locale} />
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={DEFAULT_PAGE_SIZE}
          rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
          onPageChange={handlePageChange}
          labelDisplayedRows={({ from, to, count }) => {
            const kount = count === -1 ? to + '+' : String(count);
            return `${from}–${to} / ${kount}`;
          }}
          labelRowsPerPage=""
        />
      </TableContainer>

      <OrdersRevenueCard
        filter={filter}
        totalRevenue={totalRevenue}
        grandTotalRevenue={grandTotalRevenue}
        locale={locale}
      />

      <OrderDetailDialog
        selected={selected}
        locale={locale}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
