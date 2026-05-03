'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
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
import { SearchTextField } from '@/components/SearchTextField/SearchTextField';
import {
  ToastNotification,
  type ToastMessage,
} from '@/components/ToastNotification/ToastNotification';
import type { BackendUser } from '@/types/api/user';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { RoleSortKey } from '@/features/admin/hooks/useAdminRoleManager';
import RoleManagerTableHead from './RoleManagerTableHead';
import RoleManagerTableBody from './RoleManagerTableBody';

const PAGE_SIZE = 20;

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
  readonly openAddModal: () => void;
  readonly onRequestSaveAll: () => void;
  readonly saveAllConfirmOpen: boolean;
  readonly onCancelSaveAll: () => void;
  readonly onConfirmSaveAll: () => void;
  readonly changedCount: number;
  readonly sortKey: RoleSortKey;
  readonly sortDir: 'asc' | 'desc';
  readonly onSort: (key: RoleSortKey) => void;
  readonly searchEmail: string;
  readonly searchName: string;
  readonly onSearchEmailChange: (v: string) => void;
  readonly onSearchNameChange: (v: string) => void;
  readonly onSearch: () => void;
  readonly onSearchReset: () => void;
  readonly searchToast: ToastMessage | null;
  readonly onCloseSearchToast: () => void;
  readonly page: number;
  readonly total: number;
  readonly onPageChange: (newPage: number) => void;
  readonly selectedIds: Set<string>;
  readonly onToggleSelect: (userId: string) => void;
  readonly onDeleteUser: (userId: string) => void;
  readonly onDeleteSelected: () => void;
  readonly deleteConfirm: { open: boolean; ids: string[]; email?: string };
  readonly onCancelDelete: () => void;
  readonly onConfirmDelete: () => void;
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
  openAddModal,
  onRequestSaveAll,
  saveAllConfirmOpen,
  onCancelSaveAll,
  onConfirmSaveAll,
  changedCount,
  sortKey,
  sortDir,
  onSort,
  searchEmail,
  searchName,
  onSearchEmailChange,
  onSearchNameChange,
  onSearch,
  onSearchReset,
  searchToast,
  onCloseSearchToast,
  page,
  total,
  onPageChange,
  selectedIds,
  onToggleSelect,
  onDeleteUser,
  onDeleteSelected,
  deleteConfirm,
  onCancelDelete,
  onConfirmDelete,
}: RoleManagerProps) {
  const t = createTranslator(locale);

  return (
    <>
      {/* Header */}
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
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          {selectedIds.size >= 2 && (
            <MuiButton
              variant="outlined"
              color="error"
              disabled={isPending}
              onClick={onDeleteSelected}
              startIcon={<DeleteIcon />}
              size="small"
            >
              {t('roleManagerDeleteSelected').replace('{count}', String(selectedIds.size))}
            </MuiButton>
          )}
          <MuiButton
            variant="outlined"
            sx={{
              borderColor: '#4CAF50',
              color: '#4CAF50',
              '&:hover': { borderColor: '#388E3C', color: '#388E3C' },
            }}
            disabled={changedCount < 2 || isPending}
            onClick={onRequestSaveAll}
            startIcon={<DoneAllIcon />}
            size="small"
          >
            {t('roleManagerSaveAll').replace('{count}', String(changedCount))}
          </MuiButton>
          <MuiButton
            variant="contained"
            className="btn-add"
            onClick={openAddModal}
            startIcon={<PersonAddIcon />}
            size="small"
          >
            {t('newUserButton')}
          </MuiButton>
        </Box>
      </Box>

      {/* Search bar */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end' }}
      >
        <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
          <SearchTextField
            label={t('roleManagerSearchEmail')}
            value={searchEmail}
            onChange={onSearchEmailChange}
            disabled={isPending}
          />
        </Box>
        <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
          <SearchTextField
            label={t('roleManagerSearchName')}
            value={searchName}
            onChange={onSearchNameChange}
            disabled={isPending}
          />
        </Box>
        <MuiButton
          type="submit"
          variant="contained"
          className="btn-add"
          size="small"
          startIcon={<SearchIcon />}
          disabled={isPending || (!searchEmail && !searchName)}
        >
          {t('roleManagerSearchButton')}
        </MuiButton>
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={onSearchReset}
          disabled={isPending}
        >
          {t('roleManagerSearchReset')}
        </MuiButton>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <RoleManagerTableHead
            locale={locale}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
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
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onDeleteUser={onDeleteUser}
            currentUserId={currentUserId}
          />
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          labelRowsPerPage=""
          labelDisplayedRows={({ from, to, count }) => {
            const total = count === -1 ? String(to) + '+' : String(count);
            return from + '\u2013' + to + ' / ' + total;
          }}
        />
      </TableContainer>

      {/* Search error toast */}
      <ToastNotification toast={searchToast} onClose={onCloseSearchToast} autoHideDuration={4000} />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirm.open} onClose={onCancelDelete}>
        <DialogTitle>{t('roleManagerDeleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteConfirm.ids.length === 1 && deleteConfirm.email
              ? t('roleManagerDeleteConfirmSingle').replace('{email}', deleteConfirm.email)
              : t('roleManagerDeleteConfirmBulk').replace(
                  '{count}',
                  String(deleteConfirm.ids.length)
                )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onCancelDelete}>{t('roleManagerDeleteCancel')}</MuiButton>
          <MuiButton onClick={onConfirmDelete} color="error" variant="contained">
            {t('roleManagerDeleteConfirmAction')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Save-all confirmation dialog */}
      <Dialog open={saveAllConfirmOpen} onClose={onCancelSaveAll}>
        <DialogTitle>{t('roleManagerSaveAllConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('roleManagerSaveAllConfirmText').replace('{count}', String(changedCount))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={onCancelSaveAll}>{t('roleManagerDeleteCancel')}</MuiButton>
          <MuiButton onClick={onConfirmSaveAll} color="primary" variant="contained">
            {t('roleManagerSaveAll').replace('{count}', String(changedCount))}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RoleManager;
