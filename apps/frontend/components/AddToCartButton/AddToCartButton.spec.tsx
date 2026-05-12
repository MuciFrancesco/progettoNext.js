import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BackendProduct } from '@/types/api/product';
import { AddToCartButton } from './AddToCartButton';

const product: BackendProduct = {
  id: 'product-1',
  title: 'Keyboard',
  name: 'Keyboard',
  description: 'A compact keyboard',
  imagePath: '/keyboard.png',
  imagePaths: ['/keyboard.png'],
  category: 'TECHNOLOGY',
  subcategory: null,
  brand: null,
  priceInCents: 4999,
  originalPriceInCents: null,
  stockQuantity: 8,
  isAvailableForPurchase: true,
  isRebuyable: false,
  isInSale: false,
  salePriceInCents: null,
  saleDiscountPercent: null,
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-01T10:00:00.000Z',
};

const labels = {
  addLabel: 'Aggiungi prodotto',
  decreaseLabel: 'Diminuisci',
  increaseLabel: 'Aumenta',
  quantityLabel: 'Quantita',
  removeLabel: 'Rimuovi',
  unavailableLabel: 'Non disponibile',
};

describe('AddToCartButton', () => {
  afterEach(() => cleanup());

  it('lets users type a quantity up to the available stock', () => {
    const onQuantityChange = vi.fn();

    render(
      <AddToCartButton
        product={product}
        quantity={2}
        {...labels}
        onAdd={vi.fn()}
        onDecrease={vi.fn()}
        onIncrease={vi.fn()}
        onQuantityChange={onQuantityChange}
        onRemove={vi.fn()}
      />
    );

    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantita' });
    fireEvent.change(quantityInput, { target: { value: '6' } });

    expect(onQuantityChange).toHaveBeenCalledWith(product.id, 6, product.stockQuantity);
  });
});
