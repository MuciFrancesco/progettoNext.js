import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductCatalogSubcategories } from './ProductCatalogSubcategories';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/categoria/tecnologia',
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams('q=laptop'),
}));

describe('ProductCatalogSubcategories', () => {
  afterEach(() => {
    cleanup();
    push.mockClear();
  });

  it('updates subcategory query without scrolling the current view', () => {
    render(
      <ProductCatalogSubcategories
        ariaLabel="Sottocategorie"
        items={[
          {
            slug: 'notebook',
            label: 'Notebook',
            href: '?subcategory=notebook',
            isActive: false,
            productCount: 12,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /notebook/i }));

    expect(push).toHaveBeenCalledWith('/categoria/tecnologia?q=laptop&subcategory=notebook', {
      scroll: false,
    });
  });
});
