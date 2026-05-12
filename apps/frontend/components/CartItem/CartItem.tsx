import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from './CartItem.module.scss';

export type CartItemViewModel = {
  readonly productId: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly quantity: number;
  readonly maxQuantity: number;
  readonly unitPriceLabel: string;
  readonly lineTotalLabel: string;
};

type CartItemLabels = {
  readonly quantity: string;
  readonly decreaseQuantity?: string;
  readonly increaseQuantity?: string;
  readonly remove: string;
  readonly saveForLater?: string;
};

type CartItemProps = {
  readonly item: CartItemViewModel;
  readonly labels: CartItemLabels;
  readonly warningMessage?: string;
  readonly draftQuantity: string;
  readonly onDraftChange: (value: string) => void;
  readonly onDraftBlur: () => void;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
  readonly onRemove: () => void;
  readonly onSaveForLater?: () => void;
};

export function CartItem({
  item,
  labels,
  warningMessage,
  draftQuantity,
  onDraftChange,
  onDraftBlur,
  onDecrease,
  onIncrease,
  onRemove,
  onSaveForLater,
}: Readonly<CartItemProps>) {
  return (
    <Paper
      variant="outlined"
      data-testid={`cart-item-${item.productId}`}
      className={styles.itemCard}
    >
      <Box component={Link} href={`/product/${item.productId}`} className={styles.imageFrame}>
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="112px"
            className={styles.containImage}
            unoptimized
          />
        ) : null}
      </Box>
      <Box className={styles.itemInfo}>
        <Typography
          component={Link}
          href={`/product/${item.productId}`}
          className={styles.itemTitle}
        >
          {item.title}
        </Typography>
        <Typography variant="body2" className={styles.mutedText}>
          {item.unitPriceLabel}
        </Typography>
        <Tooltip title={warningMessage ?? ''} open={Boolean(warningMessage)} placement="top" arrow>
          <Box className={styles.quantityControls}>
            <IconButton
              aria-label={labels.decreaseQuantity ?? 'decrease'}
              onClick={onDecrease}
              className={styles.quantityButton}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              type="number"
              label={labels.quantity}
              value={draftQuantity}
              size="small"
              onChange={(event) => onDraftChange(event.target.value)}
              onBlur={onDraftBlur}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: item.maxQuantity,
                  'data-testid': `cart-qty-${item.productId}`,
                },
              }}
              className={styles.quantityField}
            />
            <IconButton
              aria-label={labels.increaseQuantity ?? 'increase'}
              onClick={onIncrease}
              className={styles.quantityButton}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      <Box className={styles.itemActions}>
        <Typography className={styles.lineTotal}>{item.lineTotalLabel}</Typography>
        <Box className={styles.itemButtons}>
          {onSaveForLater && labels.saveForLater && (
            <Button
              variant="text"
              size="small"
              onClick={onSaveForLater}
              className={styles.saveForLaterBtn}
              data-testid={`cart-save-later-${item.productId}`}
            >
              {labels.saveForLater}
            </Button>
          )}
          <IconButton
            aria-label={`${labels.remove} ${item.title}`}
            onClick={onRemove}
            data-testid={`cart-remove-${item.productId}`}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
