'use client';

import { useCallback, useState } from 'react';

type UseCartDraftQuantitiesReturn = {
  readonly draftQuantities: Record<string, string>;
  readonly handleDraftChange: (productId: string, value: string) => void;
  readonly handleCommit: (productId: string, quantity: number) => void;
  readonly handleDraftBlur: (productId: string, currentQuantity: number) => void;
};

/**
 * Gestisce lo stato locale delle quantità draft nel carrello.
 * Fornisce callbacK pronte per validazione e commit verso il backend/cart context.
 */
export function useCartDraftQuantities(
  updateQuantity: (productId: string, quantity: number) => void
): UseCartDraftQuantitiesReturn {
  const [draftQuantities, setDraftQuantities] = useState<Record<string, string>>({});

  const handleDraftChange = useCallback((productId: string, value: string) => {
    setDraftQuantities((prev) => ({ ...prev, [productId]: value }));
  }, []);

  const handleCommit = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const handleDraftBlur = useCallback(
    (productId: string, currentQuantity: number) => {
      setDraftQuantities((prev) => {
        const draft = prev[productId];
        if (draft === undefined) return prev;
        const qty = Number(draft);
        if (Number.isFinite(qty) && qty >= 1) {
          updateQuantity(productId, qty);
          return prev;
        }
        return { ...prev, [productId]: String(currentQuantity) };
      });
    },
    [updateQuantity]
  );

  return {
    draftQuantities,
    handleDraftChange,
    handleCommit,
    handleDraftBlur,
  };
}
