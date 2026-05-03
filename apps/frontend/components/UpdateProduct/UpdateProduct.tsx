'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MuiButton from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LayersIcon from '@mui/icons-material/Layers';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { PRODUCT_CATEGORIES } from '@/types/api/product';
import type {
  EditableProduct,
  BulkEditDraft,
  SortField,
  SortDirection,
} from '@/features/admin/hooks/useAdminUpdateProductsTable';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { AdminRoutes } from '@/lib/routes';
import { SearchTextField } from '@/components/SearchTextField/SearchTextField';
import {
  CategoryMultiSelect,
  type SelectOption,
} from '@/components/CategoryMultiSelect/CategoryMultiSelect';
import { ToastNotification } from '@/components/ToastNotification/ToastNotification';
import UpdateProductTableHead from './UpdateProductTableHead';
import UpdateProductTableBody from './UpdateProductTableBody';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const PAGE_SIZE = 20;

interface UpdateProductProps {
  readonly products: BackendProduct[];
  readonly toast: { message: string; severity: 'success' | 'error' } | null;
  readonly closeToast: () => void;
  readonly isPending: boolean;
  readonly isLocked: boolean;
  readonly isBulkBusyRemotely: boolean;
  readonly searchCategoriesDraft: ProductCategory[];
  readonly setSearchCategoriesDraft: (cats: ProductCategory[]) => void;
  readonly searchTitleDraft: string;
  readonly setSearchTitleDraft: (v: string) => void;
  readonly searchNameDraft: string;
  readonly setSearchNameDraft: (v: string) => void;
  readonly handleProductSearch: () => void;
  readonly handleProductSearchReset: () => void;
  readonly searchError: string | null;
  readonly clearSearchError: () => void;
  readonly page: number;
  readonly total: number;
  readonly handlePageChange: (newPage: number) => void;
  readonly editingProductId: string | null;
  readonly editDraft: EditableProduct | null;
  readonly isDirty: boolean;
  readonly openEditModal: (id: string) => void;
  readonly closeEditModal: () => void;
  readonly updateEditDraft: (patch: Partial<EditableProduct>) => void;
  readonly save: () => void;
  readonly deleteProduct: (id: string) => void;
  readonly deleteConfirm: { id: string; title: string } | null;
  readonly confirmDelete: () => void;
  readonly cancelDelete: () => void;
  readonly locale: Locale;
  readonly onEditImageSelect: (file: File) => void;
  readonly onEditImageRemove: (index: number) => void;
  readonly editImageUploading: boolean;
  readonly selectedIds: Set<string>;
  readonly selectionCategory: ProductCategory | null;
  readonly toggleSelection: (id: string) => void;
  readonly toggleSelectAll: () => void;
  readonly allVisibleSelected: boolean;
  readonly someVisibleSelected: boolean;
  readonly canSelectAll: boolean;
  readonly sortField: SortField;
  readonly sortDirection: SortDirection;
  readonly handleSort: (field: SortField) => void;
  readonly isBulkModalOpen: boolean;
  readonly bulkDraft: BulkEditDraft | null;
  readonly openBulkModal: () => void;
  readonly closeBulkModal: () => void;
  readonly updateBulkDraft: (patch: Partial<BulkEditDraft>) => void;
  readonly saveBulk: () => void;
  readonly isBulkDeleteConfirmOpen: boolean;
  readonly openBulkDeleteConfirm: () => void;
  readonly closeBulkDeleteConfirm: () => void;
  readonly confirmBulkDelete: () => void;
}

function UpdateProduct({
  products,
  toast,
  closeToast,
  isPending,
  isLocked,
  isBulkBusyRemotely,
  searchCategoriesDraft,
  setSearchCategoriesDraft,
  searchTitleDraft,
  setSearchTitleDraft,
  searchNameDraft,
  setSearchNameDraft,
  handleProductSearch,
  handleProductSearchReset,
  searchError,
  clearSearchError,
  page,
  total,
  handlePageChange,
  editingProductId,
  editDraft,
  isDirty,
  openEditModal,
  closeEditModal,
  updateEditDraft,
  save,
  deleteProduct,
  deleteConfirm,
  confirmDelete,
  cancelDelete,
  locale,
  onEditImageSelect,
  onEditImageRemove,
  editImageUploading,
  selectedIds,
  selectionCategory,
  toggleSelection,
  toggleSelectAll,
  allVisibleSelected,
  someVisibleSelected,
  canSelectAll,
  sortField,
  sortDirection,
  handleSort,
  isBulkModalOpen,
  bulkDraft,
  openBulkModal,
  closeBulkModal,
  updateBulkDraft,
  saveBulk,
  isBulkDeleteConfirmOpen,
  openBulkDeleteConfirm,
  closeBulkDeleteConfirm,
  confirmBulkDelete,
}: Readonly<UpdateProductProps>) {
  const t = createTranslator(locale);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions: SelectOption[] = PRODUCT_CATEGORIES.map((cat) => ({
    value: cat,
    label: t(categoryTranslationKey(cat)),
  }));

  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      alert(t('productImageFormatError'));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert(t('productImageFormatError'));
      e.target.value = '';
      return;
    }

    onEditImageSelect(file);
  }

  return (
    <>
      <Box
        component="header"
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('updateProductPageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('updateProductPageSubtitle')}
          </Typography>
        </Box>
        <MuiButton
          variant="contained"
          className="btn-add"
          component={Link}
          href={AdminRoutes.ADD_PRODUCT}
          startIcon={<AddBoxIcon />}
          sx={{ flexShrink: 0 }}
        >
          {t('navAddProduct')}
        </MuiButton>
      </Box>

      {/* Search bar */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleProductSearch();
        }}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end' }}
      >
        <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
          <CategoryMultiSelect
            label={t('productSearchCategory')}
            options={categoryOptions}
            selected={searchCategoriesDraft}
            onChange={(vals) => setSearchCategoriesDraft(vals as ProductCategory[])}
            disabled={isLocked}
          />
        </Box>
        <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
          <SearchTextField
            label={t('productSearchTitle')}
            value={searchTitleDraft}
            onChange={setSearchTitleDraft}
            disabled={isLocked}
          />
        </Box>
        <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
          <SearchTextField
            label={t('productSearchName')}
            value={searchNameDraft}
            onChange={setSearchNameDraft}
            disabled={isLocked}
          />
        </Box>
        <MuiButton
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          disabled={
            isLocked ||
            (searchCategoriesDraft.length === 0 && !searchTitleDraft && !searchNameDraft)
          }
          size="small"
        >
          {t('productSearchButton')}
        </MuiButton>
        <MuiButton
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleProductSearchReset}
          disabled={isLocked}
          size="small"
        >
          {t('productSearchReset')}
        </MuiButton>
      </Box>

      {/* Bulk action buttons — sempre visibili, disabled se < 2 elementi selezionati */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <MuiButton
          variant="contained"
          className="btn-add"
          startIcon={<LayersIcon />}
          onClick={openBulkModal}
          disabled={isLocked || selectedIds.size < 2}
        >
          {t('productBulkEditButton').replace('{count}', String(selectedIds.size))}
        </MuiButton>
        <MuiButton
          variant="contained"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={openBulkDeleteConfirm}
          disabled={isLocked || selectedIds.size < 2}
        >
          {t('productBulkDeleteButton').replace('{count}', String(selectedIds.size))}
        </MuiButton>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <UpdateProductTableHead
            locale={locale}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            canSelectAll={canSelectAll}
            allSelected={allVisibleSelected}
            indeterminate={someVisibleSelected}
            onSelectAll={toggleSelectAll}
          />
          <UpdateProductTableBody
            products={products}
            isPending={isLocked}
            openEditModal={openEditModal}
            deleteProduct={deleteProduct}
            locale={locale}
            selectedIds={selectedIds}
            selectionCategory={selectionCategory}
            toggleSelection={toggleSelection}
          />
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={PAGE_SIZE}
        rowsPerPageOptions={[PAGE_SIZE]}
        onPageChange={(_, newPage) => handlePageChange(newPage)}
        labelRowsPerPage=""
        labelDisplayedRows={({ from, to, count }) => {
          const total = count === -1 ? String(to) + '+' : String(count);
          return from + '\u2013' + to + ' / ' + total;
        }}
      />

      {/* Search no-results error */}
      <ToastNotification
        toast={searchError ? { message: searchError, severity: 'warning' } : null}
        onClose={clearSearchError}
        autoHideDuration={5000}
      />

      {/* Single-product edit dialog */}
      <Dialog
        open={Boolean(editingProductId && editDraft)}
        onClose={isLocked ? undefined : closeEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('productSaveChangesButton')}</DialogTitle>
        {editDraft && (
          <DialogContent
            sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2, pt: 2 }}
          >
            <TextField
              label={t('productFieldTitle')}
              fullWidth
              value={editDraft.title}
              onChange={(e) => updateEditDraft({ title: e.target.value })}
              disabled={isPending}
            />
            <TextField
              label={t('productFieldName')}
              fullWidth
              value={editDraft.name}
              onChange={(e) => updateEditDraft({ name: e.target.value })}
              disabled={isPending}
            />
            <TextField
              label={t('productFieldDescription')}
              fullWidth
              multiline
              minRows={3}
              value={editDraft.description}
              onChange={(e) => updateEditDraft({ description: e.target.value })}
              sx={{ gridColumn: { md: 'span 2' } }}
              disabled={isPending}
            />
            <Box sx={{ gridColumn: { md: 'span 2' } }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                {t('productFieldPhotoUrl')} ({editDraft.imagePaths.length}/10)
              </Typography>

              {/* Image grid */}
              {editDraft.imagePaths.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
                  {editDraft.imagePaths.map((path, index) => (
                    <Box key={path + String(index)} sx={{ position: 'relative', flexShrink: 0 }}>
                      <Card
                        variant="outlined"
                        sx={{ width: 88, height: 88, borderRadius: 2, overflow: 'hidden' }}
                      >
                        <CardMedia
                          component="div"
                          sx={{ width: 88, height: 88, position: 'relative' }}
                        >
                          <Image
                            src={`${BACKEND_URL}${path}`}
                            alt={`Immagine ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </CardMedia>
                      </Card>
                      <IconButton
                        size="small"
                        onClick={() => onEditImageRemove(index)}
                        disabled={isPending || editImageUploading}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          p: '2px',
                          '&:hover': { bgcolor: 'error.light', color: 'white' },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Add image button */}
              {editDraft.imagePaths.length < 10 && (
                <div className="flex flex-col gap-1">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleEditFileChange}
                    className="text-sm file:mr-2 file:rounded-md file:border-0 file:bg-[#0D47A1] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#1565C0]"
                    disabled={editImageUploading || isPending}
                  />
                  {editImageUploading && (
                    <Typography variant="caption" color="text.secondary">
                      {t('productImageUploading')}
                    </Typography>
                  )}
                </div>
              )}

              {editDraft.imagePaths.length >= 10 && (
                <Typography variant="caption" color="text.secondary">
                  {t('productImageMaxReached')}
                </Typography>
              )}
            </Box>
            <TextField
              label={t('productFieldRemainingQty')}
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={editDraft.stockQuantity}
              onChange={(e) => updateEditDraft({ stockQuantity: e.target.value })}
              disabled={isPending}
            />
            <FormControl fullWidth disabled={isPending}>
              <InputLabel>{t('productFieldCategory')}</InputLabel>
              <Select
                value={editDraft.category}
                label={t('productFieldCategory')}
                onChange={(e) => updateEditDraft({ category: e.target.value })}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {t(categoryTranslationKey(cat))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editDraft.isAvailableForPurchase}
                  onChange={(e) => updateEditDraft({ isAvailableForPurchase: e.target.checked })}
                  disabled={isPending}
                />
              }
              label={t('productFieldAvailableForPurchase')}
            />
          </DialogContent>
        )}
        <DialogActions>
          <MuiButton
            variant="outlined"
            color="inherit"
            onClick={closeEditModal}
            disabled={isPending}
          >
            {t('newUserCancel')}
          </MuiButton>
          <MuiButton
            variant="contained"
            color="primary"
            disabled={isPending || editImageUploading || !isDirty}
            onClick={save}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          >
            {t('productSaveChangesButton')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Bulk edit dialog */}
      <Dialog
        open={isBulkModalOpen}
        onClose={isPending ? undefined : closeBulkModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('productBulkEditTitle')}</DialogTitle>
        {bulkDraft && (
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('productBulkEditSubtitle').replace('{count}', String(selectedIds.size))}
            </Typography>
            <FormControl fullWidth disabled={isPending}>
              <InputLabel>{t('productFieldCategory')}</InputLabel>
              <Select
                value={bulkDraft.category}
                label={t('productFieldCategory')}
                onChange={(e) => updateBulkDraft({ category: e.target.value })}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {t(categoryTranslationKey(cat))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={bulkDraft.isAvailableForPurchase}
                  onChange={(e) => updateBulkDraft({ isAvailableForPurchase: e.target.checked })}
                  disabled={isPending}
                />
              }
              label={t('productFieldAvailableForPurchase')}
            />
          </DialogContent>
        )}
        <DialogActions>
          <MuiButton
            variant="outlined"
            color="inherit"
            onClick={closeBulkModal}
            disabled={isPending}
          >
            {t('newUserCancel')}
          </MuiButton>
          <MuiButton
            variant="contained"
            className="btn-add"
            disabled={isPending}
            onClick={saveBulk}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          >
            {t('productSaveChangesButton')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={cancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>{t('productDeleteButton')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2">
            {t('productDeleteConfirm').replace('{title}', deleteConfirm?.title ?? '')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton variant="outlined" color="inherit" onClick={cancelDelete}>
            {t('newUserCancel')}
          </MuiButton>
          <MuiButton
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {t('productDeleteButton')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Bulk delete confirmation dialog */}
      <Dialog
        open={isBulkDeleteConfirmOpen}
        onClose={closeBulkDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>{t('productBulkDeleteTitle')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2">
            {t('productBulkDeleteSubtitle').replace('{count}', String(selectedIds.size))}
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton variant="outlined" color="inherit" onClick={closeBulkDeleteConfirm}>
            {t('newUserCancel')}
          </MuiButton>
          <MuiButton
            variant="contained"
            color="error"
            onClick={confirmBulkDelete}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {t('productDeleteButton')}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Remote bulk-in-progress notice — non-dismissible, auto-clears when polling detects completion */}
      <Dialog open={isBulkBusyRemotely} maxWidth="sm" fullWidth>
        <DialogTitle>{t('productBulkInProgressTitle')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography variant="body2">{t('productBulkInProgressBody')}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <CircularProgress size={24} />
        </DialogActions>
      </Dialog>

      {/* Auto-dismiss toast (3 s) */}
      <ToastNotification toast={toast} onClose={closeToast} autoHideDuration={3000} />
    </>
  );
}

export default UpdateProduct;
