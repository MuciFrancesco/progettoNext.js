import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicShopHeaderShell } from './PublicShopHeaderShell';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const product = {
  id: 'product-1',
  title: 'Laptop Pro',
  brand: 'Acme',
  categoryLabel: 'Tecnologia',
  subcategoryLabel: 'Notebook',
  imageSrc: '/laptop.png',
  href: '/product/product-1',
};

function renderHeader(overrides = {}) {
  return render(
    <PublicShopHeaderShell
      appName="ThinkShop"
      cartLabel="Carrello"
      homeLabel="Home"
      searchLabel="Cerca"
      searchValue=""
      categoryLabel="Categorie"
      categoryOptions={[]}
      selectedCategory=""
      onSearchValueChange={vi.fn()}
      onSearchSubmit={vi.fn()}
      onCategorySelect={vi.fn()}
      searchSuggestions={[]}
      showSearchSuggestions={false}
      {...overrides}
    />
  );
}

describe('PublicShopHeaderShell', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not fetch suggestions before three letters', () => {
    const onSearchValueChange = vi.fn();
    renderHeader({ onSearchValueChange });

    fireEvent.change(screen.getByPlaceholderText('Cerca'), { target: { value: 'la' } });

    expect(onSearchValueChange).toHaveBeenCalledWith('la');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows product suggestions with image, title, brand, category and subcategory', async () => {
    renderHeader({
      searchValue: 'lap',
      searchSuggestions: [product],
      showSearchSuggestions: true,
    });

    expect(screen.getByRole('link', { name: /laptop pro/i })).toHaveAttribute(
      'href',
      '/product/product-1'
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('Notebook')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByAltText('Laptop Pro')).toBeInTheDocument();
    });
  });

  it('submits the search form when Enter is pressed', () => {
    const onSearchSubmit = vi.fn();
    renderHeader({ searchValue: 'laptop', onSearchSubmit });

    fireEvent.submit(screen.getByRole('search'));

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});
