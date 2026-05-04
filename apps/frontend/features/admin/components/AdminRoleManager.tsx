'use client';

import { lazy, Suspense } from 'react';
import type { PaginatedUsersResponse } from '@/types/api/user';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { AddUserModal } from '@/components/AddUserModal/AddUserModal';
import { ToastNotification } from '@/components/ToastNotification/ToastNotification';
import { useAdminRoleManager, fullName } from '../hooks/useAdminRoleManager';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

const RoleManager = lazy(() => import('@/components/RoleManager/RoleManager'));

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
    <section className="space-y-4">
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
          openAddModal={openAddModal}
          onRequestSaveAll={requestSaveAll}
          saveAllConfirmOpen={saveAllConfirmOpen}
          onCancelSaveAll={cancelSaveAll}
          onConfirmSaveAll={saveAllUsers}
          changedCount={changedUserIds.length}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          searchEmail={searchEmail}
          searchName={searchName}
          onSearchEmailChange={setSearchEmail}
          onSearchNameChange={setSearchName}
          onSearch={handleSearch}
          onSearchReset={handleSearchReset}
          searchToast={searchToast}
          onCloseSearchToast={closeSearchToast}
          page={page}
          total={total}
          onPageChange={handlePageChange}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onDeleteUser={requestDeleteUser}
          onDeleteSelected={requestDeleteSelected}
          deleteConfirm={deleteConfirm}
          onCancelDelete={cancelDelete}
          onConfirmDelete={confirmDelete}
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
    </section>
  );
}
