'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  createUserAction,
  deleteUsersAction,
  getAdminUsersAction,
  updateUserRoleAction,
} from '@/lib/actions/admin';
import type { BackendUser, CreateUserInput, PaginatedUsersResponse } from '@/types/api/user';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { ToastMessage } from '@/components/ToastNotification/ToastNotification';

export type RoleSortKey = 'name' | 'email' | 'isAdmin' | 'canCreateCart' | 'canOrderProducts';

export type EditableRole = {
  isAdmin: boolean;
  canCreateCart: boolean;
  canOrderProducts: boolean;
};

export function fullName(user: BackendUser): string {
  return [user.firstname, user.secondname, user.lastname].filter(Boolean).join(' ') || user.email;
}

const PAGE_SIZE = 20;

function initDrafts(users: BackendUser[]): Record<string, EditableRole> {
  const map: Record<string, EditableRole> = {};
  for (const user of users) {
    map[user.id] = {
      isAdmin: !!user.isAdmin,
      canCreateCart: user.canCreateCart ?? true,
      canOrderProducts: user.canOrderProducts ?? true,
    };
  }
  return map;
}

export function useAdminRoleManager(initialResponse: PaginatedUsersResponse, locale: Locale) {
  const t = createTranslator(locale);
  const [users, setUsers] = useState<BackendUser[]>(initialResponse.data);
  const [total, setTotal] = useState(initialResponse.total);
  const [page, setPage] = useState(0); // 0-based for TablePagination
  const [sortKey, setSortKey] = useState<RoleSortKey>('email');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [drafts, setDrafts] = useState<Record<string, EditableRole>>(() =>
    initDrafts(initialResponse.data)
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  // Search state
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchToast, setSearchToast] = useState<ToastMessage | null>(null);

  // New-user modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);
  const [isAddPending, startAddTransition] = useTransition();

  // Selection state for bulk delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    ids: string[];
    email?: string; // set for single-user delete
  }>({ open: false, ids: [] });

  // Save-all confirmation
  const [saveAllConfirmOpen, setSaveAllConfirmOpen] = useState(false);

  // New-user form state
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formIsAdmin, setFormIsAdmin] = useState(false);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = fullName(a).localeCompare(fullName(b));
          break;
        case 'email':
          cmp = a.email.localeCompare(b.email);
          break;
        case 'isAdmin':
          cmp = Number(!!a.isAdmin) - Number(!!b.isAdmin);
          break;
        case 'canCreateCart':
          cmp = Number(a.canCreateCart ?? true) - Number(b.canCreateCart ?? true);
          break;
        case 'canOrderProducts':
          cmp = Number(a.canOrderProducts ?? true) - Number(b.canOrderProducts ?? true);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [users, sortKey, sortDir]);

  function handleSort(key: RoleSortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function loadPage(newPage: number, email?: string, name?: string) {
    startTransition(async () => {
      const res = await getAdminUsersAction({
        page: newPage + 1, // API is 1-based
        limit: PAGE_SIZE,
        email: email || undefined,
        name: name || undefined,
      });
      setUsers(res.data);
      setTotal(res.total);
      setDrafts(initDrafts(res.data));
      if (res.total === 0) {
        setSearchToast({ message: t('roleManagerSearchNoResults'), severity: 'warning' });
      }
    });
  }

  function handleSearch() {
    if (!searchEmail && !searchName) return;
    setSearchToast(null);
    setPage(0);
    loadPage(0, searchEmail, searchName);
  }

  function handleSearchReset() {
    setSearchEmail('');
    setSearchName('');
    setSearchToast(null);
    setPage(0);
    loadPage(0);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    loadPage(newPage, searchEmail || undefined, searchName || undefined);
  }

  function patchUser(updated: BackendUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  const changedUserIds = useMemo(
    () =>
      users
        .filter((user) => {
          const draft = drafts[user.id];
          if (!draft) return false;
          return (
            draft.isAdmin !== !!user.isAdmin ||
            draft.canCreateCart !== (user.canCreateCart ?? true) ||
            draft.canOrderProducts !== (user.canOrderProducts ?? true)
          );
        })
        .map((u) => u.id),
    [users, drafts]
  );

  const saveAllUsers = () => {
    if (changedUserIds.length < 2) return;
    setSaveAllConfirmOpen(false);
    startTransition(async () => {
      const results = await Promise.allSettled(
        changedUserIds.map((userId) => {
          const draft = drafts[userId];
          return updateUserRoleAction({
            userId,
            isAdmin: draft.isAdmin,
            canCreateCart: draft.canCreateCart,
            canOrderProducts: draft.canOrderProducts,
          });
        })
      );
      let successCount = 0;
      for (const result of results) {
        if (result.status === 'fulfilled') {
          patchUser(result.value);
          successCount++;
        }
      }
      setToast(
        successCount === changedUserIds.length
          ? {
              message: t('roleManagerBulkSuccess').replace('{count}', String(successCount)),
              severity: 'success',
            }
          : {
              message: t('roleManagerBulkPartial')
                .replace('{success}', String(successCount))
                .replace('{total}', String(changedUserIds.length)),
              severity: 'warning',
            }
      );
    });
  };

  const updateDraft = (userId: string, patch: Partial<EditableRole>) => {
    setDrafts((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], ...patch },
    }));
  };

  const saveUser = (userId: string) => {
    const draft = drafts[userId];
    if (!draft) return;
    startTransition(async () => {
      try {
        const updated = await updateUserRoleAction({
          userId,
          isAdmin: draft.isAdmin,
          canCreateCart: draft.canCreateCart,
          canOrderProducts: draft.canOrderProducts,
        });
        patchUser(updated);
        setToast({
          message: t('roleManagerUpdateSuccess').replace('{email}', updated.email),
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('roleManagerUpdateError'),
          severity: 'error',
        });
      }
    });
  };

  const resetUser = (userId: string) => {
    const original = users.find((u) => u.id === userId);
    if (!original) return;
    setDrafts((prev) => ({
      ...prev,
      [userId]: {
        isAdmin: !!original.isAdmin,
        canCreateCart: original.canCreateCart ?? true,
        canOrderProducts: original.canOrderProducts ?? true,
      },
    }));
  };

  // Selection helpers
  const toggleSelect = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === sortedUsers.length ? new Set() : new Set(sortedUsers.map((u) => u.id))
    );
  };

  // Delete confirmation helpers
  const requestDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setDeleteConfirm({ open: true, ids: [userId], email: user?.email });
  };

  const requestDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setDeleteConfirm({ open: true, ids: [...selectedIds] });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, ids: [] });
  };

  const confirmDelete = () => {
    const { ids, email } = deleteConfirm;
    setDeleteConfirm({ open: false, ids: [] });
    startTransition(async () => {
      try {
        const { count } = await deleteUsersAction(ids);
        setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
        setTotal((prev) => prev - count);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          for (const id of ids) next.delete(id);
          return next;
        });
        setDrafts((prev) => {
          const next = { ...prev };
          for (const id of ids) delete next[id];
          return next;
        });
        setToast({
          message:
            ids.length === 1 && email
              ? t('roleManagerDeleteSuccess').replace('{email}', email)
              : t('roleManagerDeleteBulkSuccess').replace('{count}', String(count)),
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : t('roleManagerDeleteError'),
          severity: 'error',
        });
      }
    });
  };

  const openAddModal = () => {
    setFormEmail('');
    setFormPassword('');
    setFormFirstName('');
    setFormLastName('');
    setFormIsAdmin(false);
    setAddUserError(null);
    setAddUserSuccess(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddUserError(null);
    setAddUserSuccess(null);
    setFormEmail('');
    setFormPassword('');
    setFormFirstName('');
    setFormLastName('');
    setFormIsAdmin(false);
  };

  useEffect(() => {
    if (!isAddModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAddModal();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAddModalOpen]);

  const handleAddUserSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    addUser({
      email: formEmail.trim(),
      password: formPassword,
      firstName: formFirstName.trim() || undefined,
      lastName: formLastName.trim() || undefined,
      isAdmin: formIsAdmin,
    });
  };

  const addUser = (input: CreateUserInput) => {
    setAddUserError(null);
    setAddUserSuccess(null);
    startAddTransition(async () => {
      try {
        const newUser = await createUserAction(input);
        setUsers((prev) => [...prev, newUser]);
        setTotal((prev) => prev + 1);
        setDrafts((prev) => ({
          ...prev,
          [newUser.id]: {
            isAdmin: !!newUser.isAdmin,
            canCreateCart: newUser.canCreateCart ?? true,
            canOrderProducts: newUser.canOrderProducts ?? true,
          },
        }));
        setAddUserSuccess(t('newUserSuccess'));
        setTimeout(closeAddModal, 1200);
      } catch (error) {
        const msg = error instanceof Error ? error.message : t('newUserError');
        const isConflict =
          msg.toLowerCase().includes('409') ||
          msg.toLowerCase().includes('conflict') ||
          msg.toLowerCase().includes('in uso') ||
          msg.toLowerCase().includes('already');
        setAddUserError(isConflict ? t('newUserEmailTaken') : msg);
      }
    });
  };

  return {
    sortedUsers,
    drafts,
    changedUserIds,
    toast,
    closeToast: () => setToast(null),
    isPending,
    updateDraft,
    saveUser,
    resetUser,
    saveAllUsers,
    saveAllConfirmOpen,
    requestSaveAll: () => {
      if (changedUserIds.length >= 2) setSaveAllConfirmOpen(true);
    },
    cancelSaveAll: () => setSaveAllConfirmOpen(false),
    // Selection & delete
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    deleteConfirm,
    requestDeleteUser,
    requestDeleteSelected,
    cancelDelete,
    confirmDelete,
    // Add modal
    isAddModalOpen,
    addUserError,
    addUserSuccess,
    isAddPending,
    openAddModal,
    closeAddModal,
    addUser,
    sortKey,
    sortDir,
    handleSort,
    searchEmail,
    searchName,
    setSearchEmail,
    setSearchName,
    handleSearch,
    handleSearchReset,
    searchToast,
    closeSearchToast: () => setSearchToast(null),
    page,
    total,
    handlePageChange,
    // form fields
    formEmail,
    formPassword,
    formFirstName,
    formLastName,
    formIsAdmin,
    setFormEmail,
    setFormPassword,
    setFormFirstName,
    setFormLastName,
    setFormIsAdmin,
    handleAddUserSubmit,
  };
}
