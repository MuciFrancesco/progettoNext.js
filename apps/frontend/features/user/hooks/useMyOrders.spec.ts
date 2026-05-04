import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { getMyOrdersAction } from '@/lib/actions/user';
import type { PaginatedOrdersResponse, BackendOrder } from '@/types/api/order';
import { useMyOrders } from './useMyOrders';

vi.mock('@/lib/actions/user', () => ({
  getMyOrdersAction: vi.fn(),
}));

const mockedGetMyOrdersAction = vi.mocked(getMyOrdersAction);

function createOrder(
  id: string,
  email: string,
  firstname: string | null,
  lastname: string | null,
  productName: string,
  totalPriceInCents: number,
  createdAt: string
): BackendOrder {
  return {
    id,
    totalPriceInCents,
    createdAt,
    user: {
      id: `${id}-user`,
      email,
      firstname,
      secondname: null,
      lastname,
    },
    product: {
      id: `${id}-product`,
      title: productName,
      name: productName,
      description: `${productName} description`,
      imagePath: `/${id}.png`,
      category: 'TECHNOLOGY',
      stockQuantity: 10,
      isAvailableForPurchase: true,
    },
  };
}

const initialResponse: PaginatedOrdersResponse = {
  data: [
    createOrder(
      'o1',
      'zeta@example.com',
      'Zeta',
      'Rossi',
      'Mouse',
      2500,
      '2026-05-01T10:00:00.000Z'
    ),
    createOrder(
      'o2',
      'alpha@example.com',
      'Alpha',
      'Verdi',
      'Book',
      1500,
      '2026-04-01T10:00:00.000Z'
    ),
  ],
  total: 2,
  totalRevenue: 4000,
  grandTotalRevenue: 9000,
};

const pageResponse: PaginatedOrdersResponse = {
  data: [
    createOrder(
      'o3',
      'bravo@example.com',
      'Bravo',
      'Neri',
      'Keyboard',
      3200,
      '2026-05-02T10:00:00.000Z'
    ),
  ],
  total: 3,
  totalRevenue: 3200,
  grandTotalRevenue: 12300,
};

const filterResponse: PaginatedOrdersResponse = {
  data: [
    createOrder(
      'o4',
      'gamma@example.com',
      'Gamma',
      'Bianchi',
      'Monitor',
      1800,
      '2026-05-03T10:00:00.000Z'
    ),
  ],
  total: 1,
  totalRevenue: 1800,
  grandTotalRevenue: 5400,
};

describe('useMyOrders', () => {
  beforeEach(() => {
    mockedGetMyOrdersAction.mockReset();
  });

  it('builds translated filter options for the locale', () => {
    const { result } = renderHook(() => useMyOrders(initialResponse, 'it'));

    expect(result.current.filterOptions.map((option) => option.value)).toEqual([
      'today',
      'week',
      'month',
      'year',
      'all',
    ]);
    expect(result.current.filterOptions[0]?.label).toBe('Oggi');
  });

  it('requests the next page with the current filter and refreshes totals', async () => {
    mockedGetMyOrdersAction.mockResolvedValueOnce(pageResponse);

    const { result } = renderHook(() => useMyOrders(initialResponse, 'it'));

    await act(async () => {
      result.current.handlePageChange({} as React.MouseEvent, 2);
    });

    await waitFor(() => {
      expect(mockedGetMyOrdersAction).toHaveBeenCalledWith({
        page: 3,
        limit: DEFAULT_PAGE_SIZE,
        filter: 'all',
      });
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
      expect(result.current.orders).toHaveLength(1);
      expect(result.current.total).toBe(3);
      expect(result.current.totalRevenue).toBe(3200);
      expect(result.current.grandTotalRevenue).toBe(12300);
    });
  });

  it('sorts orders by a selected key and toggles the direction', () => {
    const { result } = renderHook(() => useMyOrders(initialResponse, 'it'));

    act(() => {
      result.current.handleSort('email');
    });

    expect(result.current.sortKey).toBe('email');
    expect(result.current.sortDir).toBe('asc');
    expect(result.current.orders.map((order) => order.user.email)).toEqual([
      'alpha@example.com',
      'zeta@example.com',
    ]);

    act(() => {
      result.current.handleSort('email');
    });

    expect(result.current.sortKey).toBe('email');
    expect(result.current.sortDir).toBe('desc');
    expect(result.current.orders.map((order) => order.user.email)).toEqual([
      'zeta@example.com',
      'alpha@example.com',
    ]);
  });

  it('resets the page when the filter changes and keeps the fetch aligned to that filter', async () => {
    mockedGetMyOrdersAction
      .mockResolvedValueOnce(pageResponse)
      .mockResolvedValueOnce(filterResponse);

    const { result } = renderHook(() => useMyOrders(initialResponse, 'it'));

    await act(async () => {
      result.current.handlePageChange({} as React.MouseEvent, 2);
    });

    await waitFor(() => {
      expect(mockedGetMyOrdersAction).toHaveBeenCalledWith({
        page: 3,
        limit: DEFAULT_PAGE_SIZE,
        filter: 'all',
      });
    });

    await waitFor(() => {
      expect(result.current.total).toBe(3);
      expect(result.current.totalRevenue).toBe(3200);
      expect(result.current.grandTotalRevenue).toBe(12300);
    });

    await act(async () => {
      result.current.handleFilterChange({} as React.MouseEvent, 'month');
    });

    await waitFor(() => {
      expect(mockedGetMyOrdersAction).toHaveBeenLastCalledWith({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        filter: 'month',
      });
    });

    await waitFor(() => {
      expect(result.current.page).toBe(0);
      expect(result.current.filter).toBe('month');
      expect(result.current.orders).toHaveLength(1);
      expect(result.current.total).toBe(1);
      expect(result.current.totalRevenue).toBe(1800);
      expect(result.current.grandTotalRevenue).toBe(5400);
    });
  });
});
