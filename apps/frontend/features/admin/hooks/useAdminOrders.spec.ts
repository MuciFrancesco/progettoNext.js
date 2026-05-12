import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useAdminOrders } from './useAdminOrders';
import { getAdminOrdersAction } from '@/lib/actions/admin';
import type { PaginatedOrdersResponse } from '@/types/api/order';

vi.mock('@/lib/actions/admin', () => ({
  getAdminOrdersAction: vi.fn(),
}));

const mockedGetAdminOrdersAction = vi.mocked(getAdminOrdersAction);

const initialResponse: PaginatedOrdersResponse = {
  data: [
    {
      id: 'o1',
      totalPriceInCents: 2500,
      createdAt: '2026-05-01T10:00:00.000Z',
      user: {
        id: 'u1',
        email: 'zeta@example.com',
        firstname: 'Zeta',
        secondname: null,
        lastname: 'Rossi',
      },
      items: [
        {
          id: 'o1-item',
          quantity: 1,
          unitPriceInCents: 2500,
          lineTotalInCents: 2500,
          productTitleSnapshot: 'Mouse',
          productImageSnapshot: '/mouse.png',
          product: {
            id: 'p1',
            title: 'Mouse',
            name: 'Mouse',
            description: 'Wireless mouse',
            imagePath: '/mouse.png',
            imagePaths: ['/mouse.png'],
            category: 'TECHNOLOGY',
            priceInCents: 2500,
            stockQuantity: 4,
            isAvailableForPurchase: true,
            isRebuyable: false,
          },
        },
      ],
    },
    {
      id: 'o2',
      totalPriceInCents: 1500,
      createdAt: '2026-04-01T10:00:00.000Z',
      user: {
        id: 'u2',
        email: 'alpha@example.com',
        firstname: 'Alpha',
        secondname: null,
        lastname: 'Verdi',
      },
      items: [
        {
          id: 'o2-item',
          quantity: 1,
          unitPriceInCents: 1500,
          lineTotalInCents: 1500,
          productTitleSnapshot: 'Book',
          productImageSnapshot: '/book.png',
          product: {
            id: 'p2',
            title: 'Book',
            name: 'Book',
            description: 'Tech book',
            imagePath: '/book.png',
            imagePaths: ['/book.png'],
            category: 'BOOKS',
            priceInCents: 1500,
            stockQuantity: 9,
            isAvailableForPurchase: true,
            isRebuyable: false,
          },
        },
      ],
    },
  ],
  total: 2,
  totalRevenue: 4000,
  grandTotalRevenue: 9000,
};

describe('useAdminOrders', () => {
  beforeEach(() => {
    mockedGetAdminOrdersAction.mockReset();
  });

  it('builds translated filter options for the locale', () => {
    const { result } = renderHook(() => useAdminOrders(initialResponse, 'it'));

    expect(result.current.filterOptions.map((option) => option.value)).toEqual([
      'today',
      'week',
      'month',
      'year',
      'all',
    ]);
    expect(result.current.filterOptions[0]?.label).toBe('Oggi');
  });

  it('requests page zero with the selected filter and updates state', async () => {
    mockedGetAdminOrdersAction.mockResolvedValueOnce({
      data: [initialResponse.data[1]!],
      total: 1,
      totalRevenue: 1500,
      grandTotalRevenue: 9000,
    });

    const { result } = renderHook(() => useAdminOrders(initialResponse, 'it'));

    await act(async () => {
      result.current.handleFilterChange({} as React.MouseEvent, 'month');
    });

    await waitFor(() => {
      expect(mockedGetAdminOrdersAction).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filter: 'month',
      });
    });

    await waitFor(() => {
      expect(result.current.filter).toBe('month');
      expect(result.current.page).toBe(0);
      expect(result.current.orders).toHaveLength(1);
      expect(result.current.total).toBe(1);
    });
  });

  it('sorts orders by selected key and toggles direction', () => {
    const { result } = renderHook(() => useAdminOrders(initialResponse, 'it'));

    act(() => {
      result.current.handleSort('email');
    });

    expect(result.current.orders.map((order) => order.user.email)).toEqual([
      'alpha@example.com',
      'zeta@example.com',
    ]);

    act(() => {
      result.current.handleSort('email');
    });

    expect(result.current.orders.map((order) => order.user.email)).toEqual([
      'zeta@example.com',
      'alpha@example.com',
    ]);
  });
});
