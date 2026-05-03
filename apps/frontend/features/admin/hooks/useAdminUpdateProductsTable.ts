'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import {
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
  bulkUpdateProductsAction,
  bulkDeleteProductsAction,
  getAdminProductsBulkStatusAction,
  getAdminProductsAction,
} from '@/lib/actions/admin';
import type {
  BackendProduct,
  ProductCategory,
  PaginatedProductsResponse,
} from '@/types/api/product';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

export type SortField = 'title' | 'name' | 'category' | 'stockQuantity' | 'isAvailableForPurchase';
export type SortDirection = 'asc' | 'desc';

export type BulkEditDraft = {
  category: ProductCategory;
  isAvailableForPurchase: boolean;
};

export type EditableProduct = {
  title: string;
  name: string;
  description: string;
  imagePath: string;
  imagePaths: string[];
  stockQuantity: string;
  isAvailableForPurchase: boolean;
  category: ProductCategory;
};

function toEditableProduct(product: BackendProduct): EditableProduct {
  const paths = product.imagePaths
    ? [...product.imagePaths]
    : product.imagePath
      ? [product.imagePath]
      : [];
  return {
    title: product.title,
    name: product.name,
    description: product.description,
    imagePath: product.imagePath,
    imagePaths: paths,
    stockQuantity: String(product.stockQuantity),
    isAvailableForPurchase: product.isAvailableForPurchase,
    category: product.category,
  };
}

const PAGE_SIZE = 20;

export function useAdminUpdateProductsTable(
  initialResponse: PaginatedProductsResponse,
  locale: Locale,
  initialSearchName?: string,
  initialProductId?: string
) {
  const t = createTranslator(locale);
  const [products, setProducts] = useState(initialResponse.data);
  const [total, setTotal] = useState(initialResponse.total);
  const [page, setPage] = useState(0); // 0-based for MUI
  const [isPending, startTransition] = useTransition();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Search draft state (inputs not yet submitted)
  const [searchCategoriesDraft, setSearchCategoriesDraft] = useState<ProductCategory[]>([]);
  const [searchTitleDraft, setSearchTitleDraft] = useState('');
  const [searchNameDraft, setSearchNameDraft] = useState(initialSearchName ?? '');
  // Active (applied) search state
  const [activeCategories, setActiveCategories] = useState<ProductCategory[]>([]);
  const [activeTitle, setActiveTitle] = useState('');
  const [activeName, setActiveName] = useState(initialSearchName ?? '');
  // Search error (no results)
  const [searchError, setSearchError] = useState<string | null>(null);

  const [editDraft, setEditDraft] = useState<EditableProduct | null>(null);
  const [editOriginal, setEditOriginal] = useState<EditableProduct | null>(null);
  const [editImageUploading, setEditImageUploading] = useState(false);

  // Toast notification (auto-dismiss handled in the component via Snackbar autoHideDuration)
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  // Delete confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  // Remote bulk lock: another admin is running a bulk update
  const [isBulkBusyRemotely, setIsBulkBusyRemotely] = useState(false);

  // Check bulk status on mount
  useEffect(() => {
    void getAdminProductsBulkStatusAction()
      .then(({ isBusy }) => setIsBulkBusyRemotely(isBusy))
      .catch(() => {});
  }, []);

  // Poll every 3 s while remotely busy to detect when it finishes
  useEffect(() => {
    if (!isBulkBusyRemotely) return;
    const id = setInterval(() => {
      void getAdminProductsBulkStatusAction()
        .then(({ isBusy }) => {
          if (!isBusy) setIsBulkBusyRemotely(false);
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [isBulkBusyRemotely]);

  // Combined lock: local transition OR remote busy
  const isLocked = isPending || isBulkBusyRemotely;

  // Auto-open edit modal when navigating from duplicate warning
  useEffect(() => {
    if (!initialProductId) return;
    const product = initialResponse.data.find((p) => p.id === initialProductId);
    if (product) {
      const editable = toEditableProduct(product);
      setEditingProductId(initialProductId);
      setEditDraft(editable);
      setEditOriginal(editable);
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkDraft, setBulkDraft] = useState<BulkEditDraft | null>(null);

  // Bulk delete confirmation
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  const selectionCategory = useMemo<ProductCategory | null>(() => {
    if (selectedIds.size === 0) return null;
    const firstId = [...selectedIds][0];
    return products.find((p) => p.id === firstId)?.category ?? null;
  }, [selectedIds, products]);

  // Sort current page client-side (no more client-side category filter)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      let cmp: number;
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        cmp = Number(aVal) - Number(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [products, sortField, sortDirection]);

  // Select-all is enabled when all visible products share the same category
  const canSelectAll =
    sortedProducts.length > 0 &&
    sortedProducts.every((p) => p.category === sortedProducts[0].category) &&
    !isLocked;

  // --- Backend load helpers ---
  function loadPage(
    newPage: number,
    cats: ProductCategory[] = activeCategories,
    title: string = activeTitle,
    name: string = activeName
  ) {
    startTransition(async () => {
      try {
        const res = await getAdminProductsAction({
          categories: cats.length > 0 ? cats : undefined,
          title: title || undefined,
          name: name || undefined,
          page: newPage + 1,
          limit: PAGE_SIZE,
        });
        setProducts(res.data);
        setTotal(res.total);
        setPage(newPage);
        setSelectedIds(new Set());
        setEditingProductId(null);
        setEditDraft(null);
        if (res.total === 0 && (cats.length > 0 || title || name)) {
          setSearchError(t('productSearchNoResults'));
        }
      } catch (e) {
        setToast({ message: e instanceof Error ? e.message : 'Errore', severity: 'error' });
      }
    });
  }

  function handleProductSearch() {
    setActiveCategories(searchCategoriesDraft);
    setActiveTitle(searchTitleDraft);
    setActiveName(searchNameDraft);
    setSearchError(null);
    loadPage(0, searchCategoriesDraft, searchTitleDraft, searchNameDraft);
  }

  function handleProductSearchReset() {
    setSearchCategoriesDraft([]);
    setSearchTitleDraft('');
    setSearchNameDraft('');
    setActiveCategories([]);
    setActiveTitle('');
    setActiveName('');
    setSearchError(null);
    loadPage(0, [], '', '');
  }

  function handlePageChange(newPage: number) {
    loadPage(newPage);
  }

  function openEditModal(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const editable = toEditableProduct(product);
    setEditingProductId(productId);
    setEditDraft(editable);
    setEditOriginal(editable);
  }

  function closeEditModal() {
    setEditingProductId(null);
    setEditDraft(null);
    setEditOriginal(null);
  }

  function updateEditDraft(patch: Partial<EditableProduct>) {
    setEditDraft((prev) => (prev ? { ...prev, ...patch } : null));
  }

  function toggleSelection(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (next.size > 0 && selectionCategory && product.category !== selectionCategory) {
        return prev;
      }
      next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setSelectedIds(new Set());
  }

  function toggleSelectAll() {
    if (!canSelectAll) return;
    const allIds = sortedProducts.map((p) => p.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }

  const allVisibleSelected =
    canSelectAll && sortedProducts.length > 0 && sortedProducts.every((p) => selectedIds.has(p.id));

  const someVisibleSelected =
    sortedProducts.some((p) => selectedIds.has(p.id)) && !allVisibleSelected;

  function openBulkModal() {
    if (selectedIds.size < 2) return;
    const firstId = [...selectedIds][0];
    const firstProduct = products.find((p) => p.id === firstId);
    if (!firstProduct) return;
    setBulkDraft({
      category: firstProduct.category,
      isAvailableForPurchase: firstProduct.isAvailableForPurchase,
    });
    setIsBulkModalOpen(true);
  }

  function closeBulkModal() {
    setIsBulkModalOpen(false);
    setBulkDraft(null);
  }

  function openBulkDeleteConfirm() {
    if (selectedIds.size < 2) return;
    setIsBulkDeleteConfirmOpen(true);
  }

  function closeBulkDeleteConfirm() {
    setIsBulkDeleteConfirmOpen(false);
  }

  const confirmBulkDelete = () => {
    const ids = [...selectedIds];
    setIsBulkDeleteConfirmOpen(false);
    const notInDeletedSet = (p: BackendProduct) => !ids.includes(p.id);
    startTransition(async () => {
      try {
        const { count } = await bulkDeleteProductsAction(ids);
        setProducts((prev) => prev.filter(notInDeletedSet));
        setSelectedIds(new Set());
        setToast({
          message: t('productBulkDeleteSuccess').replace('{count}', String(count)),
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('productBulkDeleteError'),
          severity: 'error',
        });
      }
    });
  };

  function updateBulkDraft(patch: Partial<BulkEditDraft>) {
    setBulkDraft((prev) => (prev ? { ...prev, ...patch } : null));
  }

  const saveBulk = () => {
    if (!bulkDraft || selectedIds.size < 2) return;
    const ids = [...selectedIds];
    const draft = bulkDraft;

    startTransition(async () => {
      try {
        const updatedProducts = await bulkUpdateProductsAction({
          ids,
          category: draft.category,
          isAvailableForPurchase: draft.isAvailableForPurchase,
        });
        const map = new Map(updatedProducts.map((p) => [p.id, p]));
        const applyMap = (p: BackendProduct) => map.get(p.id) ?? p;
        setProducts((prev) => prev.map(applyMap));
        setToast({
          message: t('productBulkEditSuccess').replace('{count}', String(updatedProducts.length)),
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('productBulkEditError'),
          severity: 'error',
        });
      }
      setSelectedIds(new Set());
      closeBulkModal();
    });
  };

  const MAX_EDIT_IMAGES = 10;

  const onEditImageSelect = (file: File) => {
    if ((editDraft?.imagePaths.length ?? 0) >= MAX_EDIT_IMAGES) return;
    setEditImageUploading(true);

    const fd = new FormData();
    fd.append('file', file);

    uploadProductImageAction(fd)
      .then((res) => {
        setEditDraft((prev) => {
          if (!prev) return null;
          const newPaths = [...prev.imagePaths, res.imagePath].slice(0, MAX_EDIT_IMAGES);
          return { ...prev, imagePaths: newPaths, imagePath: newPaths[0] ?? '' };
        });
      })
      .catch(() => {
        setToast({ message: t('productImageUploadError'), severity: 'error' });
      })
      .finally(() => {
        setEditImageUploading(false);
      });
  };

  const onEditImageRemove = (index: number) => {
    setEditDraft((prev) => {
      if (!prev) return null;
      const newPaths = prev.imagePaths.filter((_, i) => i !== index);
      return { ...prev, imagePaths: newPaths, imagePath: newPaths[0] ?? '' };
    });
  };

  const save = () => {
    if (!editingProductId || !editDraft) return;
    const id = editingProductId;
    const draft = editDraft;

    startTransition(async () => {
      const stockQuantity = Number(draft.stockQuantity);
      if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
        setToast({ message: t('productUpdateInvalidQty'), severity: 'error' });
        return;
      }

      try {
        const updated = await updateProductAction({
          productId: id,
          title: draft.title,
          name: draft.name,
          description: draft.description,
          imagePath: draft.imagePaths[0] ?? draft.imagePath,
          imagePaths: draft.imagePaths,
          stockQuantity,
          isAvailableForPurchase: draft.isAvailableForPurchase,
          category: draft.category,
        });
        const replaceProduct = (p: BackendProduct) => (p.id === id ? updated : p);
        setProducts((prev) => prev.map(replaceProduct));
        setToast({
          message: t('productUpdateSuccess').replace('{title}', updated.title),
          severity: 'success',
        });
        closeEditModal();
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('productUpdateError'),
          severity: 'error',
        });
      }
    });
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setDeleteConfirm({ id, title: product.title });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { id, title } = deleteConfirm;
    setDeleteConfirm(null);
    startTransition(async () => {
      try {
        await deleteProductAction(id);
        const removeProduct = (p: BackendProduct) => p.id !== id;
        setProducts((prev) => prev.filter(removeProduct));
        setToast({
          message: t('productDeleteSuccess').replace('{title}', title),
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('productDeleteError'),
          severity: 'error',
        });
      }
    });
  };

  const cancelDelete = () => setDeleteConfirm(null);

  return {
    products: sortedProducts,
    total,
    page,
    handlePageChange,
    isPending,
    isLocked,
    isBulkBusyRemotely,
    toast,
    closeToast: () => setToast(null),
    searchCategoriesDraft,
    setSearchCategoriesDraft,
    searchTitleDraft,
    setSearchTitleDraft,
    searchNameDraft,
    setSearchNameDraft,
    handleProductSearch,
    handleProductSearchReset,
    searchError,
    clearSearchError: () => setSearchError(null),
    editingProductId,
    editDraft,
    isDirty:
      editDraft !== null &&
      editOriginal !== null &&
      (editDraft.title !== editOriginal.title ||
        editDraft.name !== editOriginal.name ||
        editDraft.description !== editOriginal.description ||
        editDraft.imagePath !== editOriginal.imagePath ||
        editDraft.imagePaths.length !== editOriginal.imagePaths.length ||
        editDraft.imagePaths.some((p, i) => p !== editOriginal.imagePaths[i]) ||
        editDraft.stockQuantity !== editOriginal.stockQuantity ||
        editDraft.isAvailableForPurchase !== editOriginal.isAvailableForPurchase ||
        editDraft.category !== editOriginal.category),
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
    clearSelection,
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
  };
}
