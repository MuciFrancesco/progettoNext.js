import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ProductCatalogHeader } from './ProductCatalogHeader';

describe('ProductCatalogHeader', () => {
  afterEach(() => cleanup());

  it('renders catalog copy without the embedded search field', () => {
    render(
      <ProductCatalogHeader
        brand="ThinkShop"
        title="Catalogo prodotti"
        subtitle="Scopri la selezione"
      />
    );

    expect(screen.getByText('Catalogo prodotti')).toBeInTheDocument();
    expect(screen.queryByTestId('catalog-search')).not.toBeInTheDocument();
  });
});
