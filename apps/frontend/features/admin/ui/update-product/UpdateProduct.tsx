'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import MuiButton from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
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
import styles from './UpdateProduct.module.scss';
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
import { resolveProductImageSrc } from '@/lib/shop/format';
import type { SelectOption } from '@/components/CategoryMultiSelect/CategoryMultiSelect';
import { ToastNotification } from '@/components/ToastNotification/ToastNotification';
import type { ToastMessage } from '@/components/ToastNotification/ToastNotification';
import UpdateProductTableHead from './UpdateProductTableHead';
import UpdateProductTableBody from './UpdateProductTableBody';
import { UpdateProductHeader } from './UpdateProductHeader';
import { UpdateProductSearchBar } from './UpdateProductSearchBar';
import { UpdateProductBulkActions } from './UpdateProductBulkActions';
import {
  DEFAULT_PAGE_SIZE,
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_ACCEPTED_MIME_TYPES,
  PRODUCT_IMAGE_MAX_SIZE_BYTES,
} from '@/lib/constants';

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
  const [validationToast, setValidationToast] = useState<ToastMessage | null>(null);
  const allowedImageTypes = new Set<string>(PRODUCT_IMAGE_ACCEPTED_MIME_TYPES);
  const activeToast = validationToast ?? toast;

  const categoryOptions: SelectOption[] = PRODUCT_CATEGORIES.map((cat) => ({
    value: cat,
    label: t(categoryTranslationKey(cat)),
  }));

  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.has(file.type)) {
      setValidationToast({ message: t('productImageFormatError'), severity: 'warning' });
      e.target.value = '';
      return;
    }
    if (file.size > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
      setValidationToast({ message: t('productImageFormatError'), severity: 'warning' });
      e.target.value = '';
      return;
    }

    onEditImageSelect(file);
    e.target.value = '';
  }

  return (
    <>
      <UpdateProductHeader locale={locale} />
      <UpdateProductSearchBar
        locale={locale}
        isLocked={isLocked}
        categoryOptions={categoryOptions}
        searchCategoriesDraft={searchCategoriesDraft}
        setSearchCategoriesDraft={setSearchCategoriesDraft}
        searchTitleDraft={searchTitleDraft}
        setSearchTitleDraft={setSearchTitleDraft}
        searchNameDraft={searchNameDraft}
        setSearchNameDraft={setSearchNameDraft}
        onSearch={handleProductSearch}
        onReset={handleProductSearchReset}
      />
      <UpdateProductBulkActions
        locale={locale}
        isLocked={isLocked}
        selectedCount={selectedIds.size}
        onOpenBulkEdit={openBulkModal}
        onOpenBulkDelete={openBulkDeleteConfirm}
      />

      <TableContainer component={Paper} variant="outlined" className={styles.tableWrap}>
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
        rowsPerPage={DEFAULT_PAGE_SIZE}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
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
          <DialogContent className={styles.editDialogContent}>
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
              className={styles.fullWidthField}
              disabled={isPending}
            />
            <Box className={styles.fullWidthField}>
              <Typography variant="body2" className={styles.imageLabel}>
                {t('productFieldPhotoUrl')} ({editDraft.imagePaths.length}/10)
              </Typography>

              {/* Image grid */}
              {editDraft.imagePaths.length > 0 && (
                <Box className={styles.imageList}>
                  {editDraft.imagePaths.map((path, index) => (
                    <Box key={path + String(index)} className={styles.imageItem}>
                      <Card
                        variant="outlined"
                        className={styles.imageCard}
                      >
                        <CardMedia
                          component="div"
                          className={styles.imageMedia}
                        >
                          <Image
                            src={resolveProductImageSrc(path)}
                            alt={`Immagine ${index + 1}`}
                            fill
                            className={styles.containImage}
                            unoptimized
                          />
                        </CardMedia>
                      </Card>
                      <IconButton
                        size="small"
                        onClick={() => onEditImageRemove(index)}
                        disabled={isPending || editImageUploading}
                        className={styles.removeImageButton}
                      >
                        <CloseIcon className={styles.smallIcon} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Add image button */}
              {editDraft.imagePaths.length < 10 && (
                <div className={styles.fileUploadGroup}>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept={PRODUCT_IMAGE_ACCEPT}
                    onChange={handleEditFileChange}
                    className={styles.fileInput}
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
          <DialogContent className={styles.stackedDialogContent}>
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
        <DialogTitle className={styles.dangerTitle}>{t('productDeleteButton')}</DialogTitle>
        <DialogContent className={styles.dialogContentSpacing}>
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
        <DialogTitle className={styles.dangerTitle}>{t('productBulkDeleteTitle')}</DialogTitle>
        <DialogContent className={styles.dialogContentSpacing}>
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
        <DialogContent className={styles.stackedDialogContent}>
          <Typography variant="body2">{t('productBulkInProgressBody')}</Typography>
        </DialogContent>
        <DialogActions className={styles.centeredActions}>
          <CircularProgress size={24} />
        </DialogActions>
      </Dialog>

      {/* Auto-dismiss toast (3 s) */}
      <ToastNotification
        toast={activeToast}
        onClose={() => {
          if (validationToast) {
            setValidationToast(null);
            return;
          }
          closeToast();
        }}
        autoHideDuration={3000}
      />
    </>
  );
}

export default UpdateProduct;
