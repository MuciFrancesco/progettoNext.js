import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import type { BackendOrder } from '@/types/api/order';

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
          <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
            {t('ordersTableEmpty')}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id} hover onClick={() => onRowClick(order)} sx={{ cursor: 'pointer' }}>
          <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            {order.user.email}
          </TableCell>
          <TableCell>{order.user.firstname ?? '—'}</TableCell>
          <TableCell>{order.user.lastname ?? '—'}</TableCell>
          <TableCell sx={{ fontWeight: 500 }}>{order.product.name}</TableCell>
          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
            {t(categoryTranslationKey(order.product.category))}
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
            {(order.totalPriceInCents / 100).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'EUR',
            })}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              display: { xs: 'none', sm: 'table-cell' },
              color: 'text.secondary',
              fontSize: '0.8125rem',
            }}
          >
            {new Date(order.createdAt).toLocaleDateString('it-IT')}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
