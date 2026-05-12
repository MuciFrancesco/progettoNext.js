'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BackendProduct } from '@/types/api/product';
import styles from './AddToCartButton.module.scss';

type AddToCartButtonProps = {
  readonly product: BackendProduct;
  readonly quantity: number;
  readonly addLabel: string;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly quantityLabel: string;
  readonly removeLabel: string;
  readonly unavailableLabel: string;
  readonly onAdd: (product: BackendProduct) => void;
  readonly onDecrease: (productId: string) => void;
  readonly onIncrease: (productId: string, maxStock: number) => void;
  readonly onQuantityChange: (productId: string, quantity: number, maxStock: number) => void;
  readonly onRemove: (productId: string) => void;
};

export function AddToCartButton({
  product,
  quantity,
  addLabel,
  decreaseLabel,
  increaseLabel,
  quantityLabel,
  removeLabel,
  unavailableLabel,
  onAdd,
  onDecrease,
  onIncrease,
  onQuantityChange,
  onRemove,
}: Readonly<AddToCartButtonProps>) {
  const disabled = !product.isAvailableForPurchase || product.stockQuantity <= 0;

  // Item già nel carrello → mostra controlli quantità
  if (quantity > 0) {
    const canIncrease = quantity < product.stockQuantity;

    return (
      <Box data-testid={`cart-controls-${product.id}`} className={styles.controlsGrid}>
        <IconButton
          aria-label={decreaseLabel}
          onClick={() => onDecrease(product.id)}
          data-testid={`decrease-cart-${product.id}`}
          className={styles.iconButton}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          type="number"
          value={quantity}
          size="small"
          className={styles.quantityField}
          onChange={(event) => {
            if (event.target.value === '') return;
            onQuantityChange(product.id, Number(event.target.value), product.stockQuantity);
          }}
          slotProps={{
            htmlInput: {
              min: 1,
              max: product.stockQuantity,
              step: 1,
              inputMode: 'numeric',
              'aria-label': quantityLabel,
              'data-testid': `cart-quantity-${product.id}`,
            },
          }}
        />
        <IconButton
          aria-label={increaseLabel}
          disabled={!canIncrease}
          onClick={() => onIncrease(product.id, product.stockQuantity)}
          data-testid={`increase-cart-${product.id}`}
          className={styles.iconButton}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label={removeLabel}
          onClick={() => onRemove(product.id)}
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
      onClick={() => onAdd(product)}
      data-testid={`add-to-cart-${product.id}`}
      className={styles.addButton}
    >
      {disabled ? unavailableLabel : addLabel}
    </Button>
  );
}
