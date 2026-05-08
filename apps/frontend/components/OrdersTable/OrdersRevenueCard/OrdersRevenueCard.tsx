import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { OrderFilter } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { formatCurrency } from '@/utils/format';
import styles from './OrdersRevenueCard.module.scss';

type OrdersRevenueCardProps = {
  readonly filter: OrderFilter;
  readonly totalRevenue: number;
  readonly grandTotalRevenue: number;
  readonly locale: Locale;
};

export function OrdersRevenueCard({
  filter,
  totalRevenue,
  grandTotalRevenue,
  locale,
}: Readonly<OrdersRevenueCardProps>) {
  const t = createTranslator(locale);

  return (
    <Paper variant="outlined" className={styles.card}>
      <Box className={styles.icon}>
        <TrendingUpIcon fontSize="small" />
      </Box>
      <Box>
        {filter === 'all' ? (
          <>
            <Typography variant="caption" color="text.secondary" className={styles.caption}>
              {t('ordersTotalTitle')}
            </Typography>
            <Typography variant="h5" className={styles.amount}>
              {formatCurrency(grandTotalRevenue, locale)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('ordersTotalSubtitle')}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" className={styles.caption}>
              {t('ordersTotalTitle')}
            </Typography>
            <Typography variant="h5" className={styles.amount}>
              {formatCurrency(totalRevenue, locale)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('ordersTotalSubtitle')}
            </Typography>
            <Divider className={styles.divider} />
            <Typography variant="caption" color="text.secondary" className={styles.caption}>
              {t('ordersTotalGrandTitle')}
            </Typography>
            <Typography variant="h6" className={styles.amountSecondary}>
              {formatCurrency(grandTotalRevenue, locale)}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
}
