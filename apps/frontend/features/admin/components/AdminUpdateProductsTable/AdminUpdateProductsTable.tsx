'use client';

import { lazy, Suspense } from 'react';
import type { PaginatedProductsResponse } from '@/types/api/product';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useAdminUpdateProductsTable } from '@/features/admin/hooks/useAdminUpdateProductsTable';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import styles from './AdminUpdateProductsTable.module.scss';

const UpdateProduct = lazy(() => import('@/features/admin/ui/update-product/UpdateProduct'));

type AdminUpdateProductsTableProps = {
  readonly initialResponse: PaginatedProductsResponse;
  readonly locale: Locale;
  readonly initialSearchName?: string;
  readonly initialProductId?: string;
};

export function AdminUpdateProductsTable({
  initialResponse,
  locale,
  initialSearchName,
  initialProductId,
}: Readonly<AdminUpdateProductsTableProps>) {
  const t = createTranslator(locale);
  const {
    products,
    isPending,
    isLocked,
    isBulkBusyRemotely,
    toast,
    closeToast,
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
  } = useAdminUpdateProductsTable(initialResponse, locale, initialSearchName, initialProductId);

  return (
    <section className={styles.section}>
      {isPending ? <ComponentLoading label={t('productUpdateLoading')} /> : null}

      <Suspense fallback={<ComponentLoading label={t('updateProductPageLoading')} />}>
        <UpdateProduct
          products={products}
          toast={toast}
          closeToast={closeToast}
          isPending={isPending}
          isLocked={isLocked}
          isBulkBusyRemotely={isBulkBusyRemotely}
          searchCategoriesDraft={searchCategoriesDraft}
          setSearchCategoriesDraft={setSearchCategoriesDraft}
          searchTitleDraft={searchTitleDraft}
          setSearchTitleDraft={setSearchTitleDraft}
          searchNameDraft={searchNameDraft}
          setSearchNameDraft={setSearchNameDraft}
          handleProductSearch={handleProductSearch}
          handleProductSearchReset={handleProductSearchReset}
          searchError={searchError}
          clearSearchError={clearSearchError}
          page={page}
          total={total}
          handlePageChange={handlePageChange}
          editingProductId={editingProductId}
          editDraft={editDraft}
          isDirty={isDirty}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
          updateEditDraft={updateEditDraft}
          save={save}
          deleteProduct={deleteProduct}
          deleteConfirm={deleteConfirm}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          locale={locale}
          onEditImageSelect={onEditImageSelect}
          onEditImageRemove={onEditImageRemove}
          editImageUploading={editImageUploading}
          selectedIds={selectedIds}
          selectionCategory={selectionCategory}
          toggleSelection={toggleSelection}
          toggleSelectAll={toggleSelectAll}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          canSelectAll={canSelectAll}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          isBulkModalOpen={isBulkModalOpen}
          bulkDraft={bulkDraft}
          openBulkModal={openBulkModal}
          closeBulkModal={closeBulkModal}
          updateBulkDraft={updateBulkDraft}
          saveBulk={saveBulk}
          isBulkDeleteConfirmOpen={isBulkDeleteConfirmOpen}
          openBulkDeleteConfirm={openBulkDeleteConfirm}
          closeBulkDeleteConfirm={closeBulkDeleteConfirm}
          confirmBulkDelete={confirmBulkDelete}
        />
      </Suspense>
    </section>
  );
}
