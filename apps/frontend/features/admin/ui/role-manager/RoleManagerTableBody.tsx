import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { BackendUser } from '@/types/api/user';
import styles from './RoleManager.module.scss';

interface RoleManagerTableBodyProps {
  readonly users: BackendUser[];
  readonly drafts: Record<string, Record<string, boolean>>;
  readonly isPending: boolean;
  readonly updateDraft: (userId: string, updates: Record<string, boolean>) => void;
  readonly saveUser: (userId: string) => void;
  readonly resetUser: (userId: string) => void;
  readonly fullName: (user: BackendUser) => string;
  readonly locale: Locale;
  readonly selectedIds: Set<string>;
  readonly onToggleSelect: (userId: string) => void;
  readonly onDeleteUser: (userId: string) => void;
  readonly currentUserId: string;
}

export default function RoleManagerTableBody({
  users,
  drafts,
  isPending,
  updateDraft,
  saveUser,
  resetUser,
  fullName,
  locale,
  selectedIds,
  onToggleSelect,
  onDeleteUser,
  currentUserId,
}: RoleManagerTableBodyProps) {
  const t = createTranslator(locale);

  return (
    <TableBody>
      {users.map((user) => {
        const draft = drafts[user.id];
        const isSelf = user.id === currentUserId;
        const hasChanges =
          draft !== undefined &&
          (draft.isAdmin !== !!user.isAdmin ||
            draft.isEmployee !== !!user.isEmployee ||
            draft.canCreateCart !== (user.canCreateCart ?? true) ||
            draft.canOrderProducts !== (user.canOrderProducts ?? true));

        return (
          <TableRow key={user.id} hover selected={selectedIds.has(user.id)}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedIds.has(user.id)}
                onChange={() => onToggleSelect(user.id)}
                size="small"
                disabled={isSelf}
              />
            </TableCell>
            <TableCell className={styles.nameCell}>{fullName(user)}</TableCell>
            <TableCell className={styles.mutedCell}>{user.email}</TableCell>
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={draft?.isAdmin ?? false}
                onChange={(e) => {
                  updateDraft(user.id, {
                    isAdmin: e.target.checked,
                    ...(e.target.checked ? { isEmployee: false } : {}),
                  });
                }}
                size="small"
                color="primary"
                disabled={isSelf}
              />
            </TableCell>
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={draft?.isEmployee ?? false}
                onChange={(e) => {
                  updateDraft(user.id, {
                    isEmployee: e.target.checked,
                    ...(e.target.checked ? { isAdmin: false } : {}),
                  });
                }}
                size="small"
                color="primary"
                disabled={isSelf}
              />
            </TableCell>
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={draft?.canCreateCart ?? true}
                onChange={(e) => updateDraft(user.id, { canCreateCart: e.target.checked })}
                size="small"
                color="primary"
              />
            </TableCell>
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={draft?.canOrderProducts ?? true}
                onChange={(e) => updateDraft(user.id, { canOrderProducts: e.target.checked })}
                size="small"
                color="primary"
              />
            </TableCell>
            <TableCell align="center">
              <Box className={styles.rowActions}>
                <Tooltip title={t('productSaveChangesButton')}>
                  <span>
                    <IconButton
                      size="small"
                      className={clsx(hasChanges && styles.saveButtonActive)}
                      disabled={isPending || !hasChanges}
                      onClick={() => saveUser(user.id)}
                      aria-label={t('productSaveChangesButton')}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('roleManagerReset')}>
                  <span>
                    <IconButton
                      size="small"
                      className={clsx(hasChanges && styles.resetButtonActive)}
                      disabled={isPending || !hasChanges}
                      onClick={() => resetUser(user.id)}
                      aria-label={t('roleManagerReset')}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={t('roleManagerDeleteButton')}>
                  <span>
                    <IconButton
                      size="small"
                      className={clsx(!isPending && !isSelf && styles.deleteButtonActive)}
                      disabled={isPending || isSelf}
                      onClick={() => onDeleteUser(user.id)}
                      aria-label={t('roleManagerDeleteButton')}
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
    </TableBody>
  );
}
