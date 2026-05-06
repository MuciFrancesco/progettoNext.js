'use client';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import styles from './CartBadgeLink.module.scss';

type CartBadgeLinkProps = {
  readonly label: string;
  readonly totalQuantity: number;
};

export function CartBadgeLink({ label, totalQuantity }: Readonly<CartBadgeLinkProps>) {
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
