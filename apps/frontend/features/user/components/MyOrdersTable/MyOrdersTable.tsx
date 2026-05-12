'use client';

import { lazy, Suspense } from 'react';
import type { PaginatedOrdersResponse } from '@/types/api/order';
import type { Locale } from '@/lib/i18n/translation';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { createTranslator } from '@/lib/i18n/translator';
import { useMyOrders } from '@/features/user/hooks/useMyOrders';

const OrdersTableComposed = lazy(() => import('@/features/orders/OrdersTableComposed'));

interface MyOrdersTableProps {
  readonly initialResponse: PaginatedOrdersResponse;
  readonly locale: Locale;
}

export function MyOrdersTable({ initialResponse, locale }: Readonly<MyOrdersTableProps>) {
  const t = createTranslator(locale);
  const ordersState = useMyOrders(initialResponse, locale);

  return (
    <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
      <OrdersTableComposed {...ordersState} locale={locale} />
    </Suspense>
  );
}
