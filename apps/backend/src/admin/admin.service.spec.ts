import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategory } from '@prisma/client';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkStatusStore } from './bulk-status.store';

describe('AdminService', () => {
  let service: AdminService;

  const prismaMock = {
    product: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    productImage: { deleteMany: jest.fn(), createMany: jest.fn() },
    productFeature: { deleteMany: jest.fn(), createMany: jest.fn() },
    productSpecification: { deleteMany: jest.fn(), createMany: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock.product.findMany.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        BulkStatusStore,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('reports bulk status as idle by default', () => {
    expect(service.getBulkStatus()).toEqual({ isBusy: false });
  });

  it('rejects bulk updates when no fields are provided', async () => {
    await expect(
      service.bulkUpdateProducts({
        ids: ['p1', 'p2'],
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sets and clears bulkBusy around bulk updates', async () => {
    prismaMock.product.update.mockImplementation(({ where }: { where: { id: string } }) => ({
      id: where.id,
      title: `product-${where.id}`,
    }));

    prismaMock.$transaction.mockImplementation(async (operations: Array<unknown>) => {
      expect(service.getBulkStatus()).toEqual({ isBusy: true });
      return operations;
    });

    const result = await service.bulkUpdateProducts({
      ids: ['p1', 'p2'],
      category: ProductCategory.BOOKS,
    });

    expect(result).toEqual([
      { id: 'p1', title: 'product-p1' },
      { id: 'p2', title: 'product-p2' },
    ]);
    expect(service.getBulkStatus()).toEqual({ isBusy: false });
    expect(prismaMock.product.update).toHaveBeenCalledTimes(2);
  });

  it('creates products with retail images, features, specifications, and brand fields', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    prismaMock.product.create.mockResolvedValue({ id: 'product-1', brand: 'Acme' });

    await expect(
      service.createProduct({
        title: 'Telefono premium',
        name: 'Acme Phone',
        description: 'Telefono di fascia alta',
        imagePath: '/phone-primary.png',
        imagePaths: ['/phone-primary.png', '/phone-side.png'],
        priceInCents: 99900,
        originalPriceInCents: 119900,
        stockQuantity: 10,
        category: ProductCategory.TECHNOLOGY,
        brand: 'Acme',
        images: [
          { url: '/phone-primary.png', altText: 'Frontale', sortOrder: 0, isPrimary: true },
          { url: '/phone-side.png', altText: 'Laterale', sortOrder: 1 },
        ],
        features: [{ text: 'Display luminoso', sortOrder: 0 }],
        specifications: [{ label: 'RAM', value: '12GB', sortOrder: 0 }],
        forceConfirm: true,
      })
    ).resolves.toMatchObject({ product: { id: 'product-1', brand: 'Acme' } });

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        brand: 'Acme',
        originalPriceInCents: 119900,
        imagePath: '/phone-primary.png',
        imagePaths: ['/phone-primary.png', '/phone-side.png'],
        images: { create: expect.arrayContaining([expect.objectContaining({ isPrimary: true })]) },
        features: { create: [{ text: 'Display luminoso', sortOrder: 0 }] },
        specifications: { create: [{ label: 'RAM', value: '12GB', sortOrder: 0 }] },
      }),
      select: expect.any(Object),
    });
  });

  it('updates retail relations by replacing supplied nested rows in one transaction', async () => {
    prismaMock.$transaction.mockImplementation(async (callback: unknown) => {
      if (typeof callback === 'function') {
        return callback({
          product: { update: prismaMock.product.update },
          productImage: prismaMock.productImage,
          productFeature: prismaMock.productFeature,
          productSpecification: prismaMock.productSpecification,
        });
      }
      return callback;
    });
    prismaMock.product.update.mockResolvedValue({ id: 'product-1', brand: 'Acme' });

    await service.updateProduct('product-1', {
      brand: 'Acme',
      originalPriceInCents: 129900,
      images: [{ url: '/new.png', altText: 'Nuova', sortOrder: 0, isPrimary: true }],
      features: [{ text: 'Nuova feature', sortOrder: 0 }],
      specifications: [{ label: 'Display', value: '6.7 AMOLED', sortOrder: 0 }],
    });

    expect(prismaMock.productImage.deleteMany).toHaveBeenCalledWith({
      where: { productId: 'product-1' },
    });
    expect(prismaMock.productImage.createMany).toHaveBeenCalledWith({
      data: [{ productId: 'product-1', url: '/new.png', altText: 'Nuova', sortOrder: 0, isPrimary: true }],
    });
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: expect.objectContaining({
        brand: 'Acme',
        originalPriceInCents: 129900,
        imagePath: '/new.png',
        imagePaths: ['/new.png'],
      }),
      select: expect.any(Object),
    });
  });
});
