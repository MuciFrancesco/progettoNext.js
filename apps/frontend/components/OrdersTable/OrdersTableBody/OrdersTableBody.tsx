import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import type { BackendOrder } from '@/types/api/order';
import styles from './OrdersTableBody.module.scss';

interface OrdersTableBodyProps {
  readonly orders: BackendOrder[];
  readonly onRowClick: (order: BackendOrder) => void;
  readonly locale: Locale;
}

export default function OrdersTableBody({ orders, onRowClick, locale }: OrdersTableBodyProps) {
  const t = createTranslator(locale);

  if (orders.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} align="center" className={styles.emptyCell}>
            {t('ordersTableEmpty')}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id} hover onClick={() => onRowClick(order)} className={styles.clickableRow}>
          <TableCell className={styles.mutedSmallCell}>
            {order.user.email}
          </TableCell>
          <TableCell>{order.user.firstname ?? '—'}</TableCell>
          <TableCell>{order.user.lastname ?? '—'}</TableCell>
          <TableCell className={styles.productCell}>{order.product.name}</TableCell>
          <TableCell className={styles.desktopCell}>
            {t(categoryTranslationKey(order.product.category))}
          </TableCell>
          <TableCell align="right" className={styles.totalCell}>
            {(order.totalPriceInCents / 100).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'EUR',
            })}
          </TableCell>
          <TableCell
            align="right"
            className={styles.dateCell}
          >
            {new Date(order.createdAt).toLocaleDateString('it-IT')}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
