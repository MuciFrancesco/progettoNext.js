import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BackendProduct } from '@/types/api/product';
import UpdateProductTableBody from './UpdateProductTableBody';

function product(overrides: Partial<BackendProduct> = {}): BackendProduct {
  return {
    id: 'product-1',
    title: 'Notebook Pro',
    name: 'Notebook',
    description: 'Laptop',
    brand: 'Acme',
    imagePath: '/notebook.png',
    imagePaths: ['/notebook.png'],
    category: 'TECHNOLOGY',
    subcategory: null,
    priceInCents: 120000,
    originalPriceInCents: null,
    isInSale: true,
    salePriceInCents: 90000,
    saleDiscountPercent: 25,
    stockQuantity: 8,
    isAvailableForPurchase: true,
    isRebuyable: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('UpdateProductTableBody', () => {
  afterEach(cleanup);

  it('shows effective discounted price and discount percentage', () => {
    render(
      <table>
        <UpdateProductTableBody
          products={[product()]}
          isPending={false}
          openEditModal={vi.fn()}
          deleteProduct={vi.fn()}
          locale="it"
          selectedIds={new Set()}
          selectionCategory={null}
          toggleSelection={vi.fn()}
        />
      </table>
    );

    expect(screen.getByText('900,00 €')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('shows a placeholder when no discount is applied', () => {
    render(
      <table>
        <UpdateProductTableBody
          products={[
            product({
              isInSale: false,
              salePriceInCents: null,
              saleDiscountPercent: null,
            }),
          ]}
          isPending={false}
          openEditModal={vi.fn()}
          deleteProduct={vi.fn()}
          locale="it"
          selectedIds={new Set()}
          selectionCategory={null}
          toggleSelection={vi.fn()}
        />
      </table>
    );

    expect(screen.getByText(/1200,00\s*€/)).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });
});
