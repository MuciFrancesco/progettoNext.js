'use client';

import MuiButton from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  ToastNotification,
  type ToastMessage,
} from '@/components/ToastNotification/ToastNotification';
import type { BackendUser } from '@/types/api/user';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { RoleSortKey } from '@/features/admin/hooks/useAdminRoleManager';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import RoleManagerTableHead from './RoleManagerTableHead';
import RoleManagerTableBody from './RoleManagerTableBody';
import { RoleManagerHeaderActions } from './RoleManagerHeaderActions';
import { RoleManagerSearchBar } from './RoleManagerSearchBar';

type RoleManagerHeaderActionControls = {
  readonly selectedCount: number;
  readonly changedCount: number;
  readonly onDeleteSelected: () => void;
  readonly onRequestSaveAll: () => void;
  readonly onOpenAddModal: () => void;
};

type RoleManagerSearchControls = {
  readonly searchEmail: string;
  readonly searchName: string;
  readonly onSearchEmailChange: (value: string) => void;
  readonly onSearchNameChange: (value: string) => void;
  readonly onSearch: () => void;
  readonly onSearchReset: () => void;
};

type RoleManagerTableControls = {
  readonly sortKey: RoleSortKey;
  readonly sortDir: 'asc' | 'desc';
  readonly onSort: (key: RoleSortKey) => void;
  readonly page: number;
  readonly total: number;
  readonly onPageChange: (newPage: number) => void;
};

type RoleManagerSelectionControls = {
  readonly selectedIds: Set<string>;
  readonly onToggleSelect: (userId: string) => void;
};

type RoleManagerDeleteControls = {
  readonly onDeleteUser: (userId: string) => void;
  readonly deleteConfirm: { open: boolean; ids: string[]; email?: string };
  readonly onCancelDelete: () => void;
  readonly onConfirmDelete: () => void;
};

export type RoleManagerProps = {
  readonly users: BackendUser[];
  readonly drafts: Record<string, Record<string, boolean>>;
  readonly isPending: boolean;
  readonly updateDraft: (userId: string, updates: Record<string, boolean>) => void;
  readonly saveUser: (userId: string) => void;
  readonly resetUser: (userId: string) => void;
  readonly fullName: (user: BackendUser) => string;
  readonly locale: Locale;
  readonly currentUserId: string;
  readonly headerActions: RoleManagerHeaderActionControls;
  readonly saveAllConfirmOpen: boolean;
  readonly onCancelSaveAll: () => void;
  readonly onConfirmSaveAll: () => void;
  readonly tableControls: RoleManagerTableControls;
  readonly searchControls: RoleManagerSearchControls;
  readonly searchToast: ToastMessage | null;
  readonly onCloseSearchToast: () => void;
  readonly selectionControls: RoleManagerSelectionControls;
  readonly deleteControls: RoleManagerDeleteControls;
};

function RoleManager({
  users: sortedUsers,
  drafts,
  isPending,
  updateDraft,
  saveUser,
  resetUser,
  fullName,
  locale,
  currentUserId,
  headerActions,
  saveAllConfirmOpen,
  onCancelSaveAll,
  onConfirmSaveAll,
  tableControls,
  searchControls,
  searchToast,
  onCloseSearchToast,
  selectionControls,
  deleteControls,
}: RoleManagerProps) {
  const t = createTranslator(locale);

  return (
    <>
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('rolePageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('rolePageSubtitle')}
          </Typography>
        </Box>
        <RoleManagerHeaderActions
          locale={locale}
          isPending={isPending}
          selectedCount={headerActions.selectedCount}
          changedCount={headerActions.changedCount}
          onDeleteSelected={headerActions.onDeleteSelected}
          onRequestSaveAll={headerActions.onRequestSaveAll}
          onOpenAddModal={headerActions.onOpenAddModal}
        />
      </Box>

      <RoleManagerSearchBar
        locale={locale}
        isPending={isPending}
        searchEmail={searchControls.searchEmail}
        searchName={searchControls.searchName}
        onSearchEmailChange={searchControls.onSearchEmailChange}
        onSearchNameChange={searchControls.onSearchNameChange}
        onSearch={searchControls.onSearch}
        onSearchReset={searchControls.onSearchReset}
      />

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <RoleManagerTableHead
            locale={locale}
            sortKey={tableControls.sortKey}
            sortDir={tableControls.sortDir}
            onSort={tableControls.onSort}
          />
          <RoleManagerTableBody
            users={sortedUsers}
            drafts={drafts}
            isPending={isPending}
            updateDraft={updateDraft}
            saveUser={saveUser}
            resetUser={resetUser}
            fullName={fullName}
            locale={locale}
            selectedIds={selectionControls.selectedIds}
            onToggleSelect={selectionControls.onToggleSelect}
            onDeleteUser={deleteControls.onDeleteUser}
            currentUserId={currentUserId}
          />
        </Table>
        <TablePagination
          component="div"
          count={tableControls.total}
          page={tableControls.page}
          rowsPerPage={DEFAULT_PAGE_SIZE}
          rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
          onPageChange={(_, newPage) => tableControls.onPageChange(newPage)}
          labelRowsPerPage=""
          labelDisplayedRows={({ from, to, count }) => {
            const total = count === -1 ? String(to) + '+' : String(count);
            return from + '\u2013' + to + ' / ' + total;
          }}
        />
      </TableContainer>

      <ToastNotification toast={searchToast} onClose={onCloseSearchToast} autoHideDuration={4000} />

      <Dialog open={deleteControls.deleteConfirm.open} onClose={deleteControls.onCancelDelete}>
        <DialogTitle>{t('roleManagerDeleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteControls.deleteConfirm.ids.length === 1 && deleteControls.deleteConfirm.email
              ? t('roleManagerDeleteConfirmSingle').replace(
                  '{email}',
                  deleteControls.deleteConfirm.email
                )
              : t('roleManagerDeleteConfirmBulk').replace(
                  '{count}',
                  String(deleteControls.deleteConfirm.ids.length)
                )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={deleteControls.onCancelDelete}>{t('roleManagerDeleteCancel')}</MuiButton>
          <MuiButton onClick={deleteControls.onConfirmDelete} color="error" variant="contained">
            {t('roleManagerDeleteConfirmAction')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog open={saveAllConfirmOpen} onClose={onCancelSaveAll}>
        <DialogTitle>{t('roleManagerSaveAllConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('roleManagerSaveAllConfirmText').replace(
              '{count}',
              String(headerActions.changedCount)
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onCancelSaveAll}>{t('roleManagerDeleteCancel')}</MuiButton>
          <MuiButton onClick={onConfirmSaveAll} color="primary" variant="contained">
            {t('roleManagerSaveAll').replace('{count}', String(headerActions.changedCount))}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RoleManager;
