import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductService } from './product.service';

describe('ProductService product reviews', () => {
  function serviceWithPrisma(prisma: Record<string, unknown>) {
    return new ProductService(prisma as never);
  }

  it('creates a published authenticated-user review', async () => {
    const create = jest.fn().mockResolvedValue({
      id: 'review-1',
      productId: 'product-1',
      userId: 'user-1',
      rating: 5,
      title: 'Ottimo',
      body: 'Molto valido',
      status: 'PUBLISHED',
      isVerifiedPurchase: false,
    });
    const service = serviceWithPrisma({
      orderItem: { findFirst: jest.fn().mockResolvedValue(null) },
      productReview: { create },
    });

    await expect(
      service.createProductReview('product-1', 'user-1', {
        rating: 5,
        title: 'Ottimo',
        body: 'Molto valido',
      })
    ).resolves.toMatchObject({
      status: 'PUBLISHED',
      isVerifiedPurchase: false,
    });
    expect(create).toHaveBeenCalledWith({
      data: {
        productId: 'product-1',
        userId: 'user-1',
        rating: 5,
        title: 'Ottimo',
        body: 'Molto valido',
        status: 'PUBLISHED',
        isVerifiedPurchase: false,
      },
      include: expect.any(Object),
    });
  });

  it('rejects duplicate review creation for the same user and product', async () => {
    const duplicate = new Prisma.PrismaClientKnownRequestError('duplicate', {
      code: 'P2002',
      clientVersion: 'test',
    });
    const service = serviceWithPrisma({
      orderItem: { findFirst: jest.fn().mockResolvedValue(null) },
      productReview: { create: jest.fn().mockRejectedValue(duplicate) },
    });

    await expect(
      service.createProductReview('product-1', 'user-1', {
        rating: 4,
        title: 'Gia recensito',
        body: 'Testo',
      })
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('marks a review as verified purchase when the user has a paid order item', async () => {
    const create = jest.fn().mockResolvedValue({
      id: 'review-1',
      isVerifiedPurchase: true,
    });
    const service = serviceWithPrisma({
      orderItem: { findFirst: jest.fn().mockResolvedValue({ id: 'item-1' }) },
      productReview: { create },
    });

    await service.createProductReview('product-1', 'user-1', {
      rating: 5,
      title: 'Acquisto confermato',
      body: 'Arrivato bene',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isVerifiedPurchase: true }),
      })
    );
  });

  it('updates the authenticated user review for a product', async () => {
    const update = jest.fn().mockResolvedValue({
      id: 'review-1',
      rating: 3,
      title: 'Aggiornata',
      body: 'Nuovo testo',
    });
    const service = serviceWithPrisma({
      productReview: { update },
    });

    await expect(
      service.updateMyProductReview('product-1', 'user-1', {
        rating: 3,
        title: 'Aggiornata',
        body: 'Nuovo testo',
      })
    ).resolves.toMatchObject({ rating: 3, title: 'Aggiornata' });
    expect(update).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 'user-1', productId: 'product-1' } },
      data: { rating: 3, title: 'Aggiornata', body: 'Nuovo testo' },
      include: expect.any(Object),
    });
  });

  it('throws NotFoundException when updating a missing own review', async () => {
    const missing = new Prisma.PrismaClientKnownRequestError('missing', {
      code: 'P2025',
      clientVersion: 'test',
    });
    const service = serviceWithPrisma({
      productReview: { update: jest.fn().mockRejectedValue(missing) },
    });

    await expect(
      service.updateMyProductReview('product-1', 'user-1', { body: 'Nuovo testo' })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists only published reviews for a product', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 'review-1', status: 'PUBLISHED' }]);
    const service = serviceWithPrisma({
      productReview: { findMany },
    });

    await expect(service.listProductReviews('product-1')).resolves.toEqual([
      { id: 'review-1', status: 'PUBLISHED' },
    ]);
    expect(findMany).toHaveBeenCalledWith({
      where: { productId: 'product-1', status: 'PUBLISHED' },
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    });
  });
});
