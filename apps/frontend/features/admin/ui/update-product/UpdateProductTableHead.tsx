import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { SortField, SortDirection } from '@/features/admin/hooks/useAdminUpdateProductsTable';
import styles from './UpdateProduct.module.scss';

interface UpdateProductTableHeadProps {
  readonly locale: Locale;
  readonly sortField: SortField;
  readonly sortDirection: SortDirection;
  readonly onSort: (field: SortField) => void;
  readonly canSelectAll: boolean;
  readonly allSelected: boolean;
  readonly indeterminate: boolean;
  readonly onSelectAll: () => void;
}

export default function UpdateProductTableHead({
  locale,
  sortField,
  sortDirection,
  onSort,
  canSelectAll,
  allSelected,
  indeterminate,
  onSelectAll,
}: UpdateProductTableHeadProps) {
  const t = createTranslator(locale);
  const dir = sortDirection === 'asc' ? 'asc' : 'desc';

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={indeterminate}
            disabled={!canSelectAll}
            onChange={onSelectAll}
          />
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === 'title'}
            direction={sortField === 'title' ? dir : 'asc'}
            onClick={() => onSort('title')}
          >
            {t('productTableTitle')}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === 'name'}
            direction={sortField === 'name' ? dir : 'asc'}
            onClick={() => onSort('name')}
          >
            {t('productTableName')}
          </TableSortLabel>
        </TableCell>
        <TableCell className={styles.desktopCell}>
          <TableSortLabel
            active={sortField === 'category'}
            direction={sortField === 'category' ? dir : 'asc'}
            onClick={() => onSort('category')}
          >
            {t('productTableCategory')}
          </TableSortLabel>
        </TableCell>
        <TableCell align="center">
          <TableSortLabel
            active={sortField === 'stockQuantity'}
            direction={sortField === 'stockQuantity' ? dir : 'asc'}
            onClick={() => onSort('stockQuantity')}
          >
            {t('productTableStock')}
          </TableSortLabel>
        </TableCell>
        <TableCell align="center" className={styles.tabletCell}>
          <TableSortLabel
            active={sortField === 'isAvailableForPurchase'}
            direction={sortField === 'isAvailableForPurchase' ? dir : 'asc'}
            onClick={() => onSort('isAvailableForPurchase')}
          >
            {t('productTableAvailable')}
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">{t('productTableEffectivePrice')}</TableCell>
        <TableCell align="center">{t('productTableDiscount')}</TableCell>
        <TableCell align="right">{t('productTableActions')}</TableCell>
      </TableRow>
    </TableHead>
  );
}
