'use client';

import { useMemo, useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { BackendOrder, OrderFilter, PaginatedOrdersResponse } from '@/types/api/order';
import { getAdminOrdersAction } from '@/lib/actions/admin';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { getOrderProductName } from '@/lib/orders/orderItems';

export type OrderSortKey = 'email' | 'firstName' | 'lastName' | 'product' | 'total' | 'date';

export interface FilterOption {
  value: OrderFilter;
  label: string;
}

export function useAdminOrders(initialResponse: PaginatedOrdersResponse, locale: Locale) {
  const t = createTranslator(locale);

  const [orders, setOrders] = useState<BackendOrder[]>(initialResponse.data);
  const [total, setTotal] = useState(initialResponse.total);
  const [totalRevenue, setTotalRevenue] = useState(initialResponse.totalRevenue);
  const [grandTotalRevenue, setGrandTotalRevenue] = useState(initialResponse.grandTotalRevenue);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [selected, setSelected] = useState<BackendOrder | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sortKey, setSortKey] = useState<OrderSortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filterOptions: FilterOption[] = [
    { value: 'today', label: t('ordersFilterToday') },
    { value: 'week', label: t('ordersFilterWeek') },
    { value: 'month', label: t('ordersFilterMonth') },
    { value: 'year', label: t('ordersFilterYear') },
    { value: 'all', label: t('ordersFilterAll') },
  ];

  function fetchPage(newPage: number, newFilter: OrderFilter) {
    startTransition(async () => {
      const res = await getAdminOrdersAction({
        page: newPage + 1,
        limit: DEFAULT_PAGE_SIZE,
        filter: newFilter,
      });
      setOrders(res.data);
      setTotal(res.total);
      setTotalRevenue(res.totalRevenue);
      setGrandTotalRevenue(res.grandTotalRevenue);
    });
  }

  function handleFilterChange(_: React.MouseEvent, value: OrderFilter | null) {
    if (!value) return;
    setFilter(value);
    setPage(0);
    fetchPage(0, value);
  }

  function handlePageChange(_: React.MouseEvent | null, newPage: number) {
    setPage(newPage);
    fetchPage(newPage, filter);
  }

  function handleSort(key: OrderSortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sortedOrders = useMemo(() => {
    if (!sortKey) return orders;
    return [...orders].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'email':
          cmp = a.user.email.localeCompare(b.user.email);
          break;
        case 'firstName':
          cmp = (a.user.firstname ?? '').localeCompare(b.user.firstname ?? '');
          break;
        case 'lastName':
          cmp = (a.user.lastname ?? '').localeCompare(b.user.lastname ?? '');
          break;
        case 'product':
          cmp = getOrderProductName(a).localeCompare(getOrderProductName(b));
          break;
        case 'total':
          cmp = a.totalPriceInCents - b.totalPriceInCents;
          break;
        case 'date':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [orders, sortKey, sortDir]);

  return {
    orders: sortedOrders,
    total,
    totalRevenue,
    grandTotalRevenue,
    page,
    filter,
    filterOptions,
    selected,
    isPending,
    setSelected,
    handleFilterChange,
    handlePageChange,
    sortKey,
    sortDir,
    handleSort,
  };
}
