'use client';

import { useState, useTransition } from 'react';
import { createProductAction, uploadProductImageAction } from '@/lib/actions/admin';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { CreateProductInput } from '@/types/api/product';
import type { CreateProductResponse } from '@/types/api/product';

type SimilarProduct = CreateProductResponse['similarProducts'][number];

const MAX_IMAGES = 10;

const initialDraft: CreateProductInput = {
  title: '',
  name: '',
  description: '',
  imagePaths: [],
  stockQuantity: 0,
  category: 'OTHER',
};

export function useAdminAddProductForm(locale: Locale) {
  const t = createTranslator(locale);
  const [draft, setDraft] = useState<CreateProductInput>(initialDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [imageUploading, setImageUploading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [pendingPayload, setPendingPayload] = useState<CreateProductInput | null>(null);

  const onImagesSelect = (file: File) => {
    if (draft.imagePaths.length >= MAX_IMAGES) return;
    setImageUploading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append('file', file);

    uploadProductImageAction(fd)
      .then((res) => {
        setDraft((prev) => ({
          ...prev,
          imagePaths: [...prev.imagePaths, res.imagePath].slice(0, MAX_IMAGES),
        }));
      })
      .catch(() => {
        setMessage(t('productImageUploadError'));
      })
      .finally(() => {
        setImageUploading(false);
      });
  };

  const removeImage = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      imagePaths: prev.imagePaths.filter((_, i) => i !== index),
    }));
  };

  const submit = () => {
    startTransition(async () => {
      setMessage(null);

      if (
        !draft.title.trim() ||
        !draft.name.trim() ||
        !draft.description.trim() ||
        draft.imagePaths.length === 0
      ) {
        setMessage(t('productFormRequiredFieldsError'));
        return;
      }

      const payload: CreateProductInput = {
        title: draft.title.trim(),
        name: draft.name.trim(),
        description: draft.description.trim(),
        imagePaths: draft.imagePaths,
        stockQuantity: Number(draft.stockQuantity),
        category: draft.category,
      };

      if (!Number.isFinite(payload.stockQuantity) || payload.stockQuantity < 0) {
        setMessage(t('productFormInvalidStockError'));
        return;
      }

      try {
        const firstTry = await createProductAction(payload, false);

        if (firstTry.requiresConfirmation && firstTry.similarProducts.length > 0) {
          setSimilarProducts(firstTry.similarProducts);
          setPendingPayload(payload);
          return;
        }

        setMessage(t('productFormAddedSuccess'));
        setDraft(initialDraft);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : t('productFormCreateError'));
      }
    });
  };

  const confirmDuplicate = () => {
    if (!pendingPayload) return;
    startTransition(async () => {
      try {
        await createProductAction(pendingPayload, true);
        setMessage(t('productFormAddedSuccess'));
        setDraft(initialDraft);
        setSimilarProducts([]);
        setPendingPayload(null);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : t('productFormCreateError'));
      }
    });
  };

  const cancelDuplicate = () => {
    setSimilarProducts([]);
    setPendingPayload(null);
    setMessage(t('productFormCancelled'));
  };

  return {
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
    maxImages: MAX_IMAGES,
  };
}
