'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BackendProduct } from '@/types/api/product';
import { useCart } from '@/providers/CartProvider';
import styles from './AddToCartButton.module.scss';

type AddToCartButtonProps = {
  readonly product: BackendProduct;
  readonly addLabel: string;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly removeLabel: string;
  readonly unavailableLabel: string;
  readonly onRefreshProduct?: (productId: string) => Promise<BackendProduct | undefined>;
};

export function AddToCartButton({
  product,
  addLabel,
  decreaseLabel,
  increaseLabel,
  removeLabel,
  unavailableLabel,
  onRefreshProduct,
}: Readonly<AddToCartButtonProps>) {
  const { addItem, items, removeItem, updateQuantity } = useCart();
  const disabled = !product.isAvailableForPurchase || product.stockQuantity <= 0;
  const cartItem = items.find((item) => item.product.id === product.id);

  const handleAdd = async () => {
    const latestProduct = onRefreshProduct ? await onRefreshProduct(product.id) : product;
    if (!latestProduct || !latestProduct.isAvailableForPurchase || latestProduct.stockQuantity <= 0) {
      return;
    }
    addItem(latestProduct);
  };

  if (cartItem) {
    const canIncrease = cartItem.quantity < product.stockQuantity;

    const handleIncrease = async () => {
      const latestProduct = onRefreshProduct ? await onRefreshProduct(product.id) : product;
      if (!latestProduct || latestProduct.stockQuantity <= 0) {
        return;
      }
      updateQuantity(product.id, Math.min(cartItem.quantity + 1, latestProduct.stockQuantity));
    };

    return (
      <Box data-testid={`cart-controls-${product.id}`} className={styles.controlsGrid}>
        <IconButton
          aria-label={decreaseLabel}
          onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
          data-testid={`decrease-cart-${product.id}`}
          className={styles.iconButton}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Box className={styles.quantityBox}>
          <Typography className={styles.quantityValue}>{cartItem.quantity}</Typography>
        </Box>
        <IconButton
          aria-label={increaseLabel}
          disabled={!canIncrease}
          onClick={() => void handleIncrease()}
          data-testid={`increase-cart-${product.id}`}
          className={styles.iconButton}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label={removeLabel}
          onClick={() => removeItem(product.id)}
          data-testid={`remove-cart-${product.id}`}
          className={styles.iconButton}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Button
      type="button"
      variant="contained"
      startIcon={<AddShoppingCartIcon />}
      disabled={disabled}
      onClick={() => void handleAdd()}
      data-testid={`add-to-cart-${product.id}`}
      className={styles.addButton}
    >
      {disabled ? unavailableLabel : addLabel}
    </Button>
  );
}
