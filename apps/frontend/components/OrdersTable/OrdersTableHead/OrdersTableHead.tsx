import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { OrderSortKey } from '@/features/admin/hooks/useAdminOrders';
import styles from './OrdersTableHead.module.scss';

interface OrdersTableHeadProps {
  readonly locale: Locale;
  readonly sortKey: OrderSortKey | null;
  readonly sortDir: 'asc' | 'desc';
  readonly onSort: (key: OrderSortKey) => void;
}

export default function OrdersTableHead({
  locale,
  sortKey,
  sortDir,
  onSort,
}: OrdersTableHeadProps) {
  const t = createTranslator(locale);

  function label(key: OrderSortKey, text: string) {
    return (
      <TableSortLabel
        active={sortKey === key}
        direction={sortKey === key ? sortDir : 'asc'}
        onClick={() => onSort(key)}
      >
        {text}
      </TableSortLabel>
    );
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell>{label('email', t('ordersTableColEmail'))}</TableCell>
        <TableCell>{label('firstName', t('ordersTableColFirstName'))}</TableCell>
        <TableCell>{label('lastName', t('ordersTableColLastName'))}</TableCell>
        <TableCell>{label('product', t('ordersTableColProduct'))}</TableCell>
        <TableCell className={styles.desktopCell}>
          {t('ordersTableColCategory')}
        </TableCell>
        <TableCell align="right">{label('total', t('ordersTableColTotal'))}</TableCell>
        <TableCell align="right" className={styles.tabletCell}>
          {label('date', t('ordersTableColDate'))}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
