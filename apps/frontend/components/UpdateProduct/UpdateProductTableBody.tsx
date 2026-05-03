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
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              {t(categoryTranslationKey(product.category))}
            </TableCell>
            <TableCell align="center">{product.stockQuantity}</TableCell>
            <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
              {product.isAvailableForPurchase ? (
                <Tooltip title={t('productFieldAvailableForPurchase')}>
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{ color: 'success.main', verticalAlign: 'middle' }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={t('productFieldAvailableForPurchase')}>
                  <CancelIcon
                    fontSize="small"
                    sx={{ color: 'error.main', verticalAlign: 'middle' }}
                  />
                </Tooltip>
              )}
            </TableCell>
            <TableCell align="right">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                <Tooltip title={t('productUpdateButton')}>
                  <span>
                    <IconButton
                      size="small"
                      sx={{ color: '#1565C0' }}
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
                      sx={{ color: '#EF5350' }}
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
          <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
            —
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
