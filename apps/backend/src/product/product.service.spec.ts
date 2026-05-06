import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';

describe('ProductService retail detail', () => {
  const product = {
    id: 'product-1',
    title: 'Wireless Headphones',
    name: 'Noise Cancelling Pro',
    description: 'Premium headphones',
    brand: 'SoundCore',
    priceInCents: 21990,
    originalPriceInCents: 31990,
    imagePath: '/uploads/headphones.jpg',
    imagePaths: ['/uploads/headphones.jpg'],
    category: 'TECHNOLOGY',
    stockQuantity: 7,
    isAvailableForPurchase: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    images: [
      {
        id: 'img-1',
        url: '/uploads/headphones.jpg',
        altText: 'Headphones front',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    features: [{ id: 'feat-1', text: 'Active noise cancelling', sortOrder: 0 }],
    specifications: [
      {
        id: 'spec-1',
        label: 'Connectivity',
        value: 'Bluetooth 5.3',
        sortOrder: 0,
      },
    ],
  };

  function serviceWithProduct(result: unknown) {
    return new ProductService({
      product: {
        findUnique: jest.fn().mockResolvedValue(result),
      },
      productReview: {
        aggregate: jest
          .fn()
          .mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 2 } }),
      },
    } as never);
  }

  it('returns a retail product detail with ordered relations and review aggregates', async () => {
    const service = serviceWithProduct(product);

    await expect(service.getProductById('product-1')).resolves.toMatchObject({
      id: 'product-1',
      brand: 'SoundCore',
      originalPriceInCents: 31990,
      averageRating: 4.5,
      reviewCount: 2,
      images: [{ url: '/uploads/headphones.jpg', isPrimary: true }],
      features: [{ text: 'Active noise cancelling' }],
      specifications: [{ label: 'Connectivity', value: 'Bluetooth 5.3' }],
    });
  });

  it('throws NotFoundException for missing products', async () => {
    const service = serviceWithProduct(null);

    await expect(service.getProductById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('ProductService catalog navigation', () => {
  it('returns only categories and subcategories backed by purchasable products', async () => {
    const prisma = {
      product: {
        groupBy: jest.fn().mockResolvedValue([
          { category: 'TECHNOLOGY', _count: { _all: 3 } },
          { category: 'HOME', _count: { _all: 1 } },
        ]),
      },
      productSubcategory: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'sub-pc',
            category: 'TECHNOLOGY',
            slug: 'pc',
            label: 'PC',
            heroTitle: 'Computer per lavorare meglio',
            heroSubtitle: 'Notebook, desktop e monitor selezionati.',
            heroImagePath: '/uploads/thinkshop/heroes/pc.svg',
            sortOrder: 1,
            _count: { products: 2 },
          },
          {
            id: 'sub-empty',
            category: 'TECHNOLOGY',
            slug: 'fotocamere',
            label: 'Fotocamere',
            heroTitle: 'Fotocamere',
            heroSubtitle: 'Scatti nitidi.',
            heroImagePath: '/uploads/thinkshop/heroes/fotocamere.svg',
            sortOrder: 2,
            _count: { products: 0 },
          },
        ]),
      },
    };
    const service = new ProductService(prisma as never);

    await expect(service.listCatalogNavigation()).resolves.toMatchObject({
      categories: [
        {
          category: 'TECHNOLOGY',
          slug: 'tecnologia',
          productCount: 3,
          subcategories: [
            {
              slug: 'pc',
              label: 'PC',
              productCount: 2,
            },
          ],
        },
        {
          category: 'HOME',
          slug: 'casa',
          productCount: 1,
          subcategories: [],
        },
      ],
    });
  });
});
