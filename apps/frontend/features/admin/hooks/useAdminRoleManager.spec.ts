import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminRoleManager } from './useAdminRoleManager';
import {
  getAdminUsersAction,
  updateUserRoleAction,
  createUserAction,
  deleteUsersAction,
} from '@/lib/actions/admin';
import type { PaginatedUsersResponse } from '@/types/api/user';

vi.mock('@/lib/actions/admin', () => ({
  getAdminUsersAction: vi.fn(),
  updateUserRoleAction: vi.fn(),
  createUserAction: vi.fn(),
  deleteUsersAction: vi.fn(),
}));

const mockedGetAdminUsersAction = vi.mocked(getAdminUsersAction);
const mockedUpdateUserRoleAction = vi.mocked(updateUserRoleAction);
const mockedCreateUserAction = vi.mocked(createUserAction);
const mockedDeleteUsersAction = vi.mocked(deleteUsersAction);

const initialResponse: PaginatedUsersResponse = {
  data: [
    {
      id: 'u1',
      email: 'anna@example.com',
      firstname: 'Anna',
      secondname: null,
      lastname: 'Rossi',
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      isAdmin: false,
      isEmployee: false,
      canCreateCart: true,
      canOrderProducts: true,
    },
    {
      id: 'u2',
      email: 'luca@example.com',
      firstname: 'Luca',
      secondname: null,
      lastname: 'Verdi',
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-05-01T10:00:00.000Z',
      isAdmin: true,
      isEmployee: false,
      canCreateCart: true,
      canOrderProducts: true,
    },
  ],
  total: 2,
};

describe('useAdminRoleManager', () => {
  beforeEach(() => {
    mockedGetAdminUsersAction.mockReset();
    mockedUpdateUserRoleAction.mockReset();
    mockedCreateUserAction.mockReset();
    mockedDeleteUsersAction.mockReset();
  });

  it('requests the first page with current search filters and shows a warning on empty results', async () => {
    mockedGetAdminUsersAction.mockResolvedValueOnce({
      data: [],
      total: 0,
    });

    const { result } = renderHook(() => useAdminRoleManager(initialResponse, 'it'));

    act(() => {
      result.current.setSearchEmail('nobody@example.com');
    });

    await act(async () => {
      result.current.handleSearch();
    });

    await waitFor(() => {
      expect(mockedGetAdminUsersAction).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        email: 'nobody@example.com',
        name: undefined,
      });
    });

    await waitFor(() => {
      expect(result.current.page).toBe(0);
      expect(result.current.searchToast?.severity).toBe('warning');
    });
  });

  it('persists a single user draft and reports a success toast', async () => {
    mockedUpdateUserRoleAction.mockResolvedValueOnce({
      ...initialResponse.data[0]!,
      isAdmin: true,
      isEmployee: false,
      canCreateCart: true,
      canOrderProducts: true,
    });

    const { result } = renderHook(() => useAdminRoleManager(initialResponse, 'it'));

    act(() => {
      result.current.updateDraft('u1', { isAdmin: true });
    });

    await act(async () => {
      result.current.saveUser('u1');
    });

    await waitFor(() => {
      expect(mockedUpdateUserRoleAction).toHaveBeenCalledWith({
        userId: 'u1',
        isAdmin: true,
        isEmployee: false,
        canCreateCart: true,
        canOrderProducts: true,
      });
    });

    await waitFor(() => {
      expect(result.current.toast?.severity).toBe('success');
      expect(result.current.changedUserIds).toEqual([]);
    });
  });

  it('reports backend failures while saving a user draft', async () => {
    mockedUpdateUserRoleAction.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useAdminRoleManager(initialResponse, 'it'));

    act(() => {
      result.current.updateDraft('u1', { isEmployee: true });
    });

    await act(async () => {
      result.current.saveUser('u1');
    });

    await waitFor(() => {
      expect(result.current.toast).toEqual({
        message: 'boom',
        severity: 'error',
      });
    });
  });
});
