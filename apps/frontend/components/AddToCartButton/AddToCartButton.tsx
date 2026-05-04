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

type AddToCartButtonProps = {
  readonly product: BackendProduct;
  readonly addLabel: string;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly removeLabel: string;
  readonly unavailableLabel: string;
};

export function AddToCartButton({
  product,
  addLabel,
  decreaseLabel,
  increaseLabel,
  removeLabel,
  unavailableLabel,
}: Readonly<AddToCartButtonProps>) {
  const { addItem, items, removeItem, updateQuantity } = useCart();
  const disabled = !product.isAvailableForPurchase || product.stockQuantity <= 0;
  const cartItem = items.find((item) => item.product.id === product.id);

  if (cartItem) {
    const canIncrease = cartItem.quantity < product.stockQuantity;

    return (
      <Box
        data-testid={`cart-controls-${product.id}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 44px 44px',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label={decreaseLabel}
          onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
          data-testid={`decrease-cart-${product.id}`}
          sx={{ border: '1px solid var(--border)', borderRadius: 1.5 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            minHeight: 40,
            display: 'grid',
            placeItems: 'center',
            border: '1px solid var(--border)',
            borderRadius: 1.5,
            bgcolor: 'var(--card)',
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>{cartItem.quantity}</Typography>
        </Box>
        <IconButton
          aria-label={increaseLabel}
          disabled={!canIncrease}
          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
          data-testid={`increase-cart-${product.id}`}
          sx={{ border: '1px solid var(--border)', borderRadius: 1.5 }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label={removeLabel}
          onClick={() => removeItem(product.id)}
          data-testid={`remove-cart-${product.id}`}
          sx={{ border: '1px solid var(--border)', borderRadius: 1.5 }}
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
      onClick={() => addItem(product)}
      data-testid={`add-to-cart-${product.id}`}
      sx={{ borderRadius: 1.5, width: '100%' }}
    >
      {disabled ? unavailableLabel : addLabel}
    </Button>
  );
}
