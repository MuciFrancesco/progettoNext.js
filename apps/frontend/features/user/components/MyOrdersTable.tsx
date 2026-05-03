'use client';

import { Suspense } from 'react';
import type { PaginatedOrdersResponse } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useMyOrders } from '@/features/user/hooks/useMyOrders';
import OrdersTable from '@/components/OrdersTable/OrdersTable';

interface MyOrdersTableProps {
  readonly initialResponse: PaginatedOrdersResponse;
  readonly locale: Locale;
}

export function MyOrdersTable({ initialResponse, locale }: Readonly<MyOrdersTableProps>) {
  const ordersState = useMyOrders(initialResponse, locale);

  return (
    <Suspense fallback={<ComponentLoading label="..." />}>
      <OrdersTable {...ordersState} locale={locale} />
    </Suspense>
  );
}
