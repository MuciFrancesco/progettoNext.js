import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductCatalogFeature } from './ProductCatalogFeature';

vi.mock('@/components/ProductCatalog/ProductCatalogHero', () => ({
  ProductCatalogHero: () => <section data-testid="catalog-hero">Hero</section>,
}));

vi.mock('@/components/ProductCatalog/ProductCatalogQuickNav', () => ({
  ProductCatalogQuickNav: () => <nav data-testid="catalog-quick-nav" />,
}));

vi.mock('@/components/ProductCatalog/ProductCatalogHeader', () => ({
  ProductCatalogHeader: () => <header data-testid="catalog-header" />,
}));

vi.mock('@/components/ProductCatalog/ProductCatalogSubcategories', () => ({
  ProductCatalogSubcategories: () => <section data-testid="catalog-subcategories" />,
}));

vi.mock('@/components/ProductCatalog/ProductCatalogFilters', () => ({
  ProductCatalogFilters: () => <section data-testid="catalog-filters" />,
}));

vi.mock('@/components/ProductCard/ProductCard', () => ({
  ProductCard: () => <article data-testid="product-card" />,
}));

vi.mock('@/components/AddToCartButton/AddToCartButton', () => ({
  AddToCartButton: () => <button type="button">Add</button>,
}));

vi.mock('@/features/shop/hooks/useCatalogPage', () => ({
  useCatalogPage: () => ({
    activeHero: {
      goToPrevious: vi.fn(),
      goToNext: vi.fn(),
    },
    catalog: {
      category: 'ALL',
      categoryOptions: [],
      filteredProducts: [],
      labels: { stock: 'Stock' },
      locale: 'it',
      query: '',
      setCategory: vi.fn(),
      setQuery: vi.fn(),
    },
    getCartQuantity: vi.fn(),
    handleDecrease: vi.fn(),
    handleIncrease: vi.fn(),
    handleQuantityChange: vi.fn(),
    heroData: {
      eyebrow: 'Eyebrow',
      imageSrc: '/hero.png',
      slideLabel: 'Slide',
      subtitle: 'Subtitle',
      title: 'Title',
    },
    labels: {
      brand: 'Brand',
      empty: 'Empty',
      heroPrimaryCta: 'Shop',
      heroSecondaryCta: 'Browse',
      heroSectionAria: 'Catalog hero',
      quickCategoriesAria: 'Categories',
      search: 'Search',
      subtitle: 'Subtitle',
      title: 'Title',
    },
    mappedSubcategories: [],
    onCartAdd: vi.fn(),
    onCartRemove: vi.fn(),
    quickCategories: [],
    t: (key: string) => key,
  }),
}));

describe('ProductCatalogFeature', () => {
  afterEach(() => cleanup());

  it('renders personalized content immediately after the hero', () => {
    render(
      <ProductCatalogFeature products={[]} locale="it" heroSlides={[]}>
        <section data-testid="personalized-content">Personalized</section>
      </ProductCatalogFeature>
    );

    const section = screen.getByTestId('product-catalog');
    const children = Array.from(section.children);

    expect(children[0]).toBe(screen.getByTestId('catalog-hero'));
    expect(children[1]).toBe(screen.getByTestId('personalized-content'));
  });

  it('does not render the category filter chips above the product grid', () => {
    render(<ProductCatalogFeature products={[]} locale="it" heroSlides={[]} />);

    expect(screen.queryByTestId('catalog-filters')).not.toBeInTheDocument();
  });

  it('does not render catalog quick filters because categories live in the header', () => {
    render(<ProductCatalogFeature products={[]} locale="it" heroSlides={[]} />);

    expect(screen.queryByTestId('catalog-quick-nav')).not.toBeInTheDocument();
  });
});
