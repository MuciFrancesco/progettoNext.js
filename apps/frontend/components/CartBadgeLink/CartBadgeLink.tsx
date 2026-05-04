'use client';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useCart } from '@/providers/CartProvider';

type CartBadgeLinkProps = {
  readonly label: string;
};

export function CartBadgeLink({ label }: Readonly<CartBadgeLinkProps>) {
  const { totalQuantity } = useCart();

  return (
    <Button
      component={Link}
      href="/cart"
      variant="outlined"
      startIcon={
        <Badge badgeContent={totalQuantity} color="primary">
          <ShoppingCartIcon fontSize="small" />
        </Badge>
      }
      sx={{ borderRadius: 1.5, color: 'var(--foreground)', borderColor: 'var(--border)' }}
    >
      {label}
    </Button>
  );
}
