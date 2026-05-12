'use client';

import { lazy, Suspense } from 'react';
import type { PaginatedOrdersResponse } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { createTranslator } from '@/lib/i18n/translator';
import { useAdminOrders } from '@/features/admin/hooks/useAdminOrders';

const OrdersTableComposed = lazy(() => import('@/features/orders/OrdersTableComposed'));

interface AdminOrdersTableProps {
  readonly initialResponse: PaginatedOrdersResponse;
  readonly locale: Locale;
}

export function AdminOrdersTable({ initialResponse, locale }: Readonly<AdminOrdersTableProps>) {
  const t = createTranslator(locale);
  const ordersState = useAdminOrders(initialResponse, locale);

  return (
    <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
      <OrdersTableComposed {...ordersState} locale={locale} />
    </Suspense>
  );
}
