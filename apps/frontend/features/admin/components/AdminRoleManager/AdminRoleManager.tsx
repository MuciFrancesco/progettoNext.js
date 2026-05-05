'use client';

import { lazy, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import type { PaginatedUsersResponse } from '@/types/api/user';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { AddUserModal } from '@/features/admin/ui/add-user-modal/AddUserModal';
import { ToastNotification } from '@/components/ToastNotification/ToastNotification';
import { useAdminRoleManager, fullName } from '@/features/admin/hooks/useAdminRoleManager';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

const RoleManager = lazy(() => import('@/features/admin/ui/role-manager/RoleManager'));

type AdminRoleManagerProps = {
  readonly initialResponse: PaginatedUsersResponse;
  readonly locale: Locale;
  readonly currentUserId: string;
};

export function AdminRoleManager({
  initialResponse,
  locale,
  currentUserId,
}: Readonly<AdminRoleManagerProps>) {
  const t = createTranslator(locale);
  const {
    sortedUsers,
    drafts,
    changedUserIds,
    toast,
    closeToast,
    isPending,
    updateDraft,
    saveUser,
    resetUser,
    saveAllUsers,
    saveAllConfirmOpen,
    requestSaveAll,
    cancelSaveAll,
    selectedIds,
    toggleSelect,
    deleteConfirm,
    requestDeleteUser,
    requestDeleteSelected,
    cancelDelete,
    confirmDelete,
    isAddModalOpen,
    addUserError,
    addUserSuccess,
    isAddPending,
    openAddModal,
    closeAddModal,
    formEmail,
    formPassword,
    formFirstName,
    formLastName,
    formIsAdmin,
    formIsEmployee,
    setFormEmail,
    setFormPassword,
    setFormFirstName,
    setFormLastName,
    setFormIsAdmin,
    setFormIsEmployee,
    handleAddUserSubmit,
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
    closeSearchToast,
    page,
    total,
    handlePageChange,
  } = useAdminRoleManager(initialResponse, locale);

  return (
    <Stack component="section" spacing={2}>
      {isPending ? <ComponentLoading label={t('roleManagerLoading')} /> : null}
      <Suspense fallback={<ComponentLoading label={t('roleManagerLoading')} />}>
        <RoleManager
          users={sortedUsers}
          drafts={drafts}
          isPending={isPending}
          updateDraft={updateDraft}
          saveUser={saveUser}
          resetUser={resetUser}
          fullName={fullName}
          locale={locale}
          currentUserId={currentUserId}
          headerActions={{
            selectedCount: selectedIds.size,
            changedCount: changedUserIds.length,
            onDeleteSelected: requestDeleteSelected,
            onRequestSaveAll: requestSaveAll,
            onOpenAddModal: openAddModal,
          }}
          saveAllConfirmOpen={saveAllConfirmOpen}
          onCancelSaveAll={cancelSaveAll}
          onConfirmSaveAll={saveAllUsers}
          tableControls={{
            sortKey,
            sortDir,
            onSort: handleSort,
            page,
            total,
            onPageChange: handlePageChange,
          }}
          searchControls={{
            searchEmail,
            searchName,
            onSearchEmailChange: setSearchEmail,
            onSearchNameChange: setSearchName,
            onSearch: handleSearch,
            onSearchReset: handleSearchReset,
          }}
          searchToast={searchToast}
          onCloseSearchToast={closeSearchToast}
          selectionControls={{
            selectedIds,
            onToggleSelect: toggleSelect,
          }}
          deleteControls={{
            onDeleteUser: requestDeleteUser,
            deleteConfirm,
            onCancelDelete: cancelDelete,
            onConfirmDelete: confirmDelete,
          }}
        />
        <AddUserModal
          locale={locale}
          isOpen={isAddModalOpen}
          formEmail={formEmail}
          formPassword={formPassword}
          formFirstName={formFirstName}
          formLastName={formLastName}
          formIsAdmin={formIsAdmin}
          formIsEmployee={formIsEmployee}
          isAddPending={isAddPending}
          addUserError={addUserError}
          addUserSuccess={addUserSuccess}
          onClose={closeAddModal}
          onSubmit={handleAddUserSubmit}
          onEmailChange={setFormEmail}
          onPasswordChange={setFormPassword}
          onFirstNameChange={setFormFirstName}
          onLastNameChange={setFormLastName}
          onIsAdminChange={setFormIsAdmin}
          onIsEmployeeChange={setFormIsEmployee}
        />
      </Suspense>
      <ToastNotification toast={toast} onClose={closeToast} />
    </Stack>
  );
}
