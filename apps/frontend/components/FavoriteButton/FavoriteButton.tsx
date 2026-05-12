'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { BackendProduct } from '@/types/api/product';
import { useWishlist } from '@/store/WishlistContext';
import styles from './FavoriteButton.module.scss';

type FavoriteButtonProps = {
  readonly product: BackendProduct;
  readonly saveLabel: string;
  readonly removeLabel: string;
};

export function FavoriteButton({ product, saveLabel, removeLabel }: Readonly<FavoriteButtonProps>) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isPending, setIsPending] = useState(false);
  const active = isInWishlist(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    setIsPending(true);
    try {
      if (active) {
        await removeItem(product.id);
      } else {
        await addItem(product, 1);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Tooltip title={active ? removeLabel : saveLabel} placement="top" arrow>
      <span>
        <IconButton
          aria-label={active ? removeLabel : saveLabel}
          onClick={handleClick}
          disabled={isPending}
          className={styles.btn}
          size="small"
        >
          {active ? (
            <FavoriteIcon className={styles.activeIcon} fontSize="small" />
          ) : (
            <FavoriteBorderIcon className={styles.icon} fontSize="small" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
