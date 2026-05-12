import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProductAction, uploadProductImageAction } from '@/lib/actions/admin';
import { useAdminAddProductForm } from './useAdminAddProductForm';

vi.mock('@/lib/actions/admin', () => ({
  createProductAction: vi.fn(),
  uploadProductImageAction: vi.fn(),
}));

const mockedCreateProductAction = vi.mocked(createProductAction);
const mockedUploadProductImageAction = vi.mocked(uploadProductImageAction);

describe('useAdminAddProductForm retail fields', () => {
  beforeEach(() => {
    mockedCreateProductAction.mockReset();
    mockedUploadProductImageAction.mockReset();
    mockedCreateProductAction.mockResolvedValue({
      created: true,
      requiresConfirmation: false,
      similarProducts: [],
    });
  });

  it('adds uploaded images and keeps exactly one primary image', async () => {
    mockedUploadProductImageAction
      .mockResolvedValueOnce({ imagePath: '/one.png' })
      .mockResolvedValueOnce({ imagePath: '/two.png' });
    const { result } = renderHook(() => useAdminAddProductForm('it'));

    act(() => result.current.onImagesSelect(new File(['a'], 'one.png', { type: 'image/png' })));
    await waitFor(() => expect(result.current.draft.images).toHaveLength(1));
    act(() => result.current.onImagesSelect(new File(['b'], 'two.png', { type: 'image/png' })));
    await waitFor(() => expect(result.current.draft.images).toHaveLength(2));

    expect(result.current.draft.images?.filter((image) => image.isPrimary)).toHaveLength(1);
    expect(result.current.draft.images?.[0]?.isPrimary).toBe(true);
  });

  it('submits brand, original price, features, and specifications', async () => {
    const { result } = renderHook(() => useAdminAddProductForm('it'));

    act(() => {
      result.current.setDraft({
        title: 'Telefono',
        name: 'Acme Phone',
        description: 'Descrizione',
        brand: 'Acme',
        imagePaths: ['/phone.png'],
        images: [{ url: '/phone.png', altText: 'Telefono', sortOrder: 0, isPrimary: true }],
        priceInCents: 99900,
        originalPriceInCents: 119900,
        stockQuantity: 4,
        category: 'TECHNOLOGY',
        isAvailableForPurchase: false,
        isRebuyable: true,
        features: [{ text: 'Display luminoso', sortOrder: 0 }],
        specifications: [{ label: 'RAM', value: '12GB', sortOrder: 0 }],
      });
    });

    await act(async () => result.current.submit());

    await waitFor(() =>
      expect(mockedCreateProductAction).toHaveBeenCalledWith(
        expect.objectContaining({
          brand: 'Acme',
          isAvailableForPurchase: false,
          isRebuyable: true,
          originalPriceInCents: 119900,
          images: [{ url: '/phone.png', altText: 'Telefono', sortOrder: 0, isPrimary: true }],
          features: [{ text: 'Display luminoso', sortOrder: 0 }],
          specifications: [{ label: 'RAM', value: '12GB', sortOrder: 0 }],
        }),
        false
      )
    );
  });

  it('defaults new products to available for purchase', () => {
    const { result } = renderHook(() => useAdminAddProductForm('it'));

    expect(result.current.draft.isAvailableForPurchase).toBe(true);
  });
});
