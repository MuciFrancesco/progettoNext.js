'use client';

import { lazy, Suspense } from 'react';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { useAdminAddProductForm } from '@/features/admin/hooks/useAdminAddProductForm';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import styles from './AdminAddProductForm.module.scss';

const AddProductForm = lazy(() => import('@/features/admin/ui/add-product/AddProductForm'));

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
    <section className={styles.section}>
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
