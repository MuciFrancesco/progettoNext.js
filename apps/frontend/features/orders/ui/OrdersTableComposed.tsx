'use client';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiButton from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import type { BackendOrder, OrderFilter } from '@/types/api/order';
import { getOrderProductName } from '@/lib/orders/orderItems';
import type { FilterOption, OrderSortKey } from '@/features/admin/hooks/useAdminOrders';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import OrdersTableHead from '@/components/OrdersTable/OrdersTableHead/OrdersTableHead';
import OrdersTableBody from '@/components/OrdersTable/OrdersTableBody/OrdersTableBody';
import styles from '@/components/OrdersTable/OrdersTable/OrdersTable.module.scss';

const LOCALE_MAP: Record<Locale, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

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
  const displayLocale = LOCALE_MAP[locale];

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

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        size="small"
        className={styles.filterGroup}
      >
        {filterOptions.map((f) => (
          <ToggleButton key={f.value} value={f.value} disabled={isPending}>
            {f.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

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
            return from + '\u2013' + to + ' / ' + kount;
          }}
          labelRowsPerPage=""
        />
      </TableContainer>

      <Paper variant="outlined" className={styles.revenueCard}>
        <Box className={styles.revenueIcon}>
          <TrendingUpIcon fontSize="small" />
        </Box>
        <Box>
          {filter === 'all' ? (
            <>
              <Typography variant="caption" color="text.secondary" className={styles.revenueCaption}>
                {t('ordersTotalTitle')}
              </Typography>
              <Typography variant="h5" className={styles.revenueAmount}>
                {(grandTotalRevenue / 100).toLocaleString(displayLocale, {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('ordersTotalSubtitle')}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary" className={styles.revenueCaption}>
                {t('ordersTotalTitle')}
              </Typography>
              <Typography variant="h5" className={styles.revenueAmount}>
                {(totalRevenue / 100).toLocaleString(displayLocale, {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('ordersTotalSubtitle')}
              </Typography>
              <Divider className={styles.revenueDivider} />
              <Typography variant="caption" color="text.secondary" className={styles.revenueCaption}>
                {t('ordersTotalGrandTitle')}
              </Typography>
              <Typography variant="h6" className={styles.revenueAmountSecondary}>
                {(grandTotalRevenue / 100).toLocaleString(displayLocale, {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle>{t('ordersTableDetailTitle')}</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" className={styles.detailSubtitle}>
                {t('ordersTableDetailItemsTitle')}
              </Typography>
              <TableContainer component={Paper} variant="outlined" className={styles.detailTable}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('ordersTableColProduct')}</TableCell>
                      <TableCell>{t('ordersTableColCategory')}</TableCell>
                      <TableCell align="right">{t('ordersTableDetailPrice')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selected.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productTitleSnapshot || item.product.name}</TableCell>
                        <TableCell>
                          <Chip label={t(categoryTranslationKey(item.product.category))} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {(item.lineTotalInCents / 100).toLocaleString(displayLocale, {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="caption" color="text.secondary">
                {getOrderProductName(selected)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={() => setSelected(null)}>{t('ordersTableDetailClose')}</MuiButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
