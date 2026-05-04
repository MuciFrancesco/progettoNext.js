'use client';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useCart } from '@/providers/CartProvider';
import styles from './CartBadgeLink.module.scss';

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
      className={styles.button}
    >
      {label}
    </Button>
  );
}
