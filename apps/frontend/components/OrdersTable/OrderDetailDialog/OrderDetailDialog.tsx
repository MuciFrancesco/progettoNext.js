import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import type { BackendOrder } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey, formatCurrency, formatUserName, toDisplayLocale } from '@/utils/format';
import { getOrderProductName } from '@/lib/orders/orderItems';
import styles from './OrderDetailDialog.module.scss';

type OrderDetailDialogProps = {
  readonly selected: BackendOrder | null;
  readonly locale: Locale;
  readonly onClose: () => void;
};

export function OrderDetailDialog({
  selected,
  locale,
  onClose,
}: Readonly<OrderDetailDialogProps>) {
  const t = createTranslator(locale);
  const displayLocale = toDisplayLocale(locale);

  return (
    <Dialog open={Boolean(selected)} onClose={onClose} maxWidth="sm" fullWidth>
      {selected && (
        <>
          <DialogTitle>{t('ordersTableDetailTitle')}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" className={styles.subtitle}>
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
                        <Chip
                          label={t(categoryTranslationKey(item.product.category))}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.lineTotalInCents, locale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" color="text.secondary">
              {getOrderProductName(selected)}
            </Typography>
            <Box className={styles.grid}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('ordersTableDetailPrice')}
                </Typography>
                <Typography variant="body1" className={styles.price}>
                  {formatCurrency(selected.totalPriceInCents, locale)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('ordersTableDetailDate')}
                </Typography>
                <Typography variant="body1">
                  {new Date(selected.createdAt).toLocaleDateString(displayLocale, {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('ordersTableColEmail')}
                </Typography>
                <Typography variant="body2">{selected.user.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('ordersTableColFirstName')} / {t('ordersTableColLastName')}
                </Typography>
                <Typography variant="body2">
                  {formatUserName(selected.user.firstname, selected.user.lastname)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <MuiButton variant="outlined" onClick={onClose}>
              {t('ordersTableDetailClose')}
            </MuiButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
