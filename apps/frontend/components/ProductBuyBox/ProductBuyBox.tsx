import type { ReactNode } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import styles from './ProductBuyBox.module.scss';

type ProductBuyBoxLabels = {
  readonly ariaLabel: string;
  readonly deliveryTitle: string;
  readonly deliveryDate: string;
  readonly deliveryVendor: string;
  readonly trustLabel: string;
  readonly returns: string;
  readonly securePayment: string;
  readonly warranty: string;
};

type ProductBuyBoxProps = {
  readonly inStock: boolean;
  readonly stockLabel: string;
  readonly price: ReactNode;
  readonly action: ReactNode;
  readonly labels: ProductBuyBoxLabels;
};

export function ProductBuyBox({
  inStock,
  stockLabel,
  price,
  action,
  labels,
}: Readonly<ProductBuyBoxProps>) {
  return (
    <Stack component="aside" spacing={2} className={styles.buyBox} aria-label={labels.ariaLabel}>
      <Stack spacing={1}>
        <Box className={styles.stockRow}>
          <CheckCircleIcon color={inStock ? 'success' : 'error'} fontSize="small" />
          <Typography color={inStock ? 'success.main' : 'error.main'}>{stockLabel}</Typography>
        </Box>
        {price}
      </Stack>

      {inStock ? (
        <Stack spacing={0.5} className={styles.deliveryBox}>
          <Typography className={styles.deliveryTitle}>
            <ShoppingBagIcon fontSize="small" />
            {labels.deliveryTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {labels.deliveryDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {labels.deliveryVendor}
          </Typography>
        </Stack>
      ) : null}

      {action}

      <Divider />

      <Stack spacing={1} aria-label={labels.trustLabel}>
        <Box className={styles.trustItem}>
          <ShoppingBagIcon fontSize="small" />
          <Typography variant="body2">{labels.returns}</Typography>
        </Box>
        <Box className={styles.trustItem}>
          <LockIcon fontSize="small" />
          <Typography variant="body2">{labels.securePayment}</Typography>
        </Box>
        <Box className={styles.trustItem}>
          <CheckCircleIcon fontSize="small" />
          <Typography variant="body2">{labels.warranty}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
