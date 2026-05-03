import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { RoleSortKey } from '@/features/admin/hooks/useAdminRoleManager';

interface RoleManagerTableHeadProps {
  readonly locale: Locale;
  readonly sortKey: RoleSortKey;
  readonly sortDir: 'asc' | 'desc';
  readonly onSort: (key: RoleSortKey) => void;
}

export default function RoleManagerTableHead({
  locale,
  sortKey,
  sortDir,
  onSort,
}: RoleManagerTableHeadProps) {
  const t = createTranslator(locale);

  function label(key: RoleSortKey, text: string, align?: 'center') {
    return (
      <TableSortLabel
        active={sortKey === key}
        direction={sortKey === key ? sortDir : 'asc'}
        onClick={() => onSort(key)}
      >
        {text}
      </TableSortLabel>
    );
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        <TableCell>{label('name', t('roleTableUser'))}</TableCell>
        <TableCell>{label('email', t('roleTableEmail'))}</TableCell>
        <TableCell align="center">{label('isAdmin', t('roleTableAdmin'), 'center')}</TableCell>
        <TableCell align="center">
          {label('canCreateCart', t('roleTableCanCreateCart'), 'center')}
        </TableCell>
        <TableCell align="center">
          {label('canOrderProducts', t('roleTableCanOrderProducts'), 'center')}
        </TableCell>
        <TableCell align="center">{t('roleTableAction')}</TableCell>
      </TableRow>
    </TableHead>
  );
}
