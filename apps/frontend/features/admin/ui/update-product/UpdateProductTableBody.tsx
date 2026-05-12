import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency } from '@/lib/shop/format';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import styles from './UpdateProduct.module.scss';

interface UpdateProductTableBodyProps {
  readonly products: BackendProduct[];
  readonly isPending: boolean;
  readonly openEditModal: (id: string) => void;
  readonly deleteProduct: (id: string) => void;
  readonly locale: Locale;
  readonly selectedIds: Set<string>;
  readonly selectionCategory: ProductCategory | null;
  readonly toggleSelection: (id: string) => void;
}

export default function UpdateProductTableBody({
  products,
  isPending,
  openEditModal,
  deleteProduct,
  locale,
  selectedIds,
  selectionCategory,
  toggleSelection,
}: UpdateProductTableBodyProps) {
  const t = createTranslator(locale);

  return (
    <TableBody>
      {products.map((product) => {
        const isChecked = selectedIds.has(product.id);
        const isDisabled =
          isPending ||
          (selectionCategory !== null && !isChecked && product.category !== selectionCategory);
        const effectivePrice = getEffectivePriceInCents(product);
        const discountLabel =
          product.isInSale && product.saleDiscountPercent ? `${product.saleDiscountPercent}%` : '--';

        return (
          <TableRow key={product.id} hover selected={isChecked}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => toggleSelection(product.id)}
                size="small"
              />
            </TableCell>
            <TableCell>{product.title}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell className={styles.desktopCell}>
              {t(categoryTranslationKey(product.category))}
            </TableCell>
            <TableCell align="center">{product.stockQuantity}</TableCell>
            <TableCell align="center" className={styles.tabletCell}>
              {product.isAvailableForPurchase ? (
                <Tooltip title={t('productFieldAvailableForPurchase')}>
                  <CheckCircleIcon
                    fontSize="small"
                    className={styles.successIcon}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={t('productFieldAvailableForPurchase')}>
                  <CancelIcon
                    fontSize="small"
                    className={styles.errorIcon}
                  />
                </Tooltip>
              )}
            </TableCell>
            <TableCell align="right">{formatCurrency(effectivePrice, locale)}</TableCell>
            <TableCell align="center">{discountLabel}</TableCell>
            <TableCell align="right">
              <Box className={styles.rowActions}>
                <Tooltip title={t('productUpdateButton')}>
                  <span>
                    <IconButton
                      size="small"
                      className={styles.editButton}
                      onClick={() => openEditModal(product.id)}
                      disabled={isPending}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('productDeleteButton')}>
                  <span>
                    <IconButton
                      size="small"
                      className={styles.deleteButton}
                      onClick={() => deleteProduct(product.id)}
                      disabled={isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
      {products.length === 0 && (
        <TableRow>
          <TableCell colSpan={9} align="center" className={styles.emptyCell}>
            —
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
