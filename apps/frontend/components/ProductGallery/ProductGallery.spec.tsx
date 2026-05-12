import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProductImage } from '@/types/api/product';
import { ProductGallery } from './ProductGallery';

vi.mock('next/image', () => ({
  default: ({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} className={className} />
  ),
}));

const images: ProductImage[] = [
  {
    id: 'image-1',
    url: '/front.png',
    altText: 'Front view',
    sortOrder: 1,
  },
  {
    id: 'image-2',
    url: '/side.png',
    altText: 'Side view',
    sortOrder: 2,
  },
  {
    id: 'image-3',
    url: '/detail.png',
    altText: 'Detail view',
    sortOrder: 3,
  },
];

const labels = {
  gallery: 'Product gallery',
  image: (position: number) => `Show product image ${position}`,
  empty: 'No product image',
};

function renderGallery(activeIndex = 0) {
  const onSelectImage = vi.fn();

  render(
    <ProductGallery
      images={images}
      activeImage={images[activeIndex]}
      activeIndex={activeIndex}
      fallbackAlt="Fallback product"
      labels={labels}
      onSelectImage={onSelectImage}
    />
  );

  return { onSelectImage };
}

describe('ProductGallery', () => {
  afterEach(() => {
    cleanup();
  });

  it('navigates between enlarged images in the lightbox', async () => {
    renderGallery();

    fireEvent.click(screen.getByRole('button', { name: /front view/i }));

    const dialog = screen.getByRole('dialog', { name: /product gallery/i });
    expect(within(dialog).getByRole('img', { name: 'Front view' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /next image/i }));
    expect(within(dialog).getByRole('img', { name: 'Side view' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /previous image/i }));
    expect(within(dialog).getByRole('img', { name: 'Front view' })).toBeInTheDocument();
  });

  it('wraps lightbox navigation and lets thumbnails select an enlarged image', async () => {
    renderGallery(2);

    fireEvent.click(screen.getByRole('button', { name: /detail view/i }));

    const dialog = screen.getByRole('dialog', { name: /product gallery/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /next image/i }));
    expect(within(dialog).getByRole('img', { name: 'Front view' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /show enlarged image 2/i }));
    expect(within(dialog).getByRole('img', { name: 'Side view' })).toBeInTheDocument();
  });
});
