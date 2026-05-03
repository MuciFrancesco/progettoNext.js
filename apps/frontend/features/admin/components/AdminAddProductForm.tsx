'use client';

import { lazy, Suspense } from 'react';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useAdminAddProductForm } from '../hooks/useAdminAddProductForm';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

const AddProductForm = lazy(() => import('@/components/AddProductForm/AddProductForm'));

export function AdminAddProductForm({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);
  const {
    draft,
    setDraft,
    message,
    isPending,
    submit,
    onImagesSelect,
    removeImage,
    imageUploading,
    similarProducts,
    confirmDuplicate,
    cancelDuplicate,
    maxImages,
  } = useAdminAddProductForm(locale);

  return (
    <section className="space-y-4 rounded-xl border border-border p-4">
      <Suspense fallback={<ComponentLoading label={t('productFormLoading')} />}>
        {isPending ? (
          <ComponentLoading label={t('productFormLoading')} />
        ) : (
          <AddProductForm
            locale={locale}
            message={message}
            draft={draft}
            setDraft={setDraft}
            submit={submit}
            isPending={isPending}
            onImagesSelect={onImagesSelect}
            removeImage={removeImage}
            imageUploading={imageUploading}
            similarProducts={similarProducts}
            confirmDuplicate={confirmDuplicate}
            cancelDuplicate={cancelDuplicate}
            maxImages={maxImages}
          />
        )}
      </Suspense>
    </section>
  );
}
