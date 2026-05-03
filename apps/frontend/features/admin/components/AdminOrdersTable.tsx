'use client';

import { Suspense } from 'react';
import type { PaginatedOrdersResponse } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useAdminOrders } from '@/features/admin/hooks/useAdminOrders';
import OrdersTable from '@/components/OrdersTable/OrdersTable';

interface AdminOrdersTableProps {
  readonly initialResponse: PaginatedOrdersResponse;
  readonly locale: Locale;
}

export function AdminOrdersTable({ initialResponse, locale }: Readonly<AdminOrdersTableProps>) {
  const ordersState = useAdminOrders(initialResponse, locale);

  return (
    <Suspense fallback={<ComponentLoading label="..." />}>
      <OrdersTable {...ordersState} locale={locale} />
    </Suspense>
  );
}
