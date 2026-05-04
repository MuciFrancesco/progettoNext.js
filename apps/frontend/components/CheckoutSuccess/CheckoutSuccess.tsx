'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type CheckoutSuccessLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly backToCatalog: string;
  readonly orders: string;
};

export function CheckoutSuccess({ labels }: Readonly<{ labels: CheckoutSuccessLabels }>) {
  return (
    <Box
      component="section"
      data-testid="checkout-success-page"
      className="mx-auto flex w-full max-w-2xl px-4 py-12 sm:px-6"
    >
      <Paper variant="outlined" sx={{ width: '100%', p: 4, borderRadius: 2, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'var(--primary)', mb: 2 }} />
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
          {labels.title}
        </Typography>
        <Typography sx={{ mt: 2, color: 'var(--muted-foreground)' }}>{labels.subtitle}</Typography>
        <Box className="mt-6 flex justify-center gap-3">
          <Button component={Link} href="/" variant="contained" sx={{ borderRadius: 1.5 }}>
            {labels.backToCatalog}
          </Button>
          <Button component={Link} href="/user/orders" variant="outlined" sx={{ borderRadius: 1.5 }}>
            {labels.orders}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
