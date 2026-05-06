import { CheckoutService } from './checkout.service';

describe('CheckoutService multi-product orders', () => {
  it('captures multiple products into one order with order item snapshots', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const productUpdate = jest.fn().mockResolvedValue({});
    const orderCreate = jest.fn().mockResolvedValue({
      id: 'order-1',
      totalPriceInCents: 5000,
      createdAt,
    });
    const prisma = {
      product: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'product-1',
            title: 'Mouse Pro',
            imagePath: '/mouse.png',
            imagePaths: ['/mouse.png'],
            priceInCents: 2000,
            stockQuantity: 5,
            isAvailableForPurchase: true,
          },
          {
            id: 'product-2',
            title: 'Keyboard Pro',
            imagePath: '/keyboard.png',
            imagePaths: ['/keyboard.png'],
            priceInCents: 3000,
            stockQuantity: 3,
            isAvailableForPurchase: true,
          },
        ]),
      },
      $transaction: jest.fn((callback) =>
        callback({
          product: { update: productUpdate },
          order: { create: orderCreate },
        })
      ),
    };
    const service = new CheckoutService(prisma as never);

    await expect(
      service.captureOrder('user-1', [
        { productId: 'product-1', quantity: 1 },
        { productId: 'product-2', quantity: 1 },
      ])
    ).resolves.toEqual({
      order: { id: 'order-1', totalPriceInCents: 5000, createdAt },
      totalInCents: 5000,
    });

    expect(productUpdate).toHaveBeenCalledTimes(2);
    expect(orderCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        status: 'PAID',
        totalPriceInCents: 5000,
        items: {
          create: [
            {
              productId: 'product-1',
              quantity: 1,
              unitPriceInCents: 2000,
              lineTotalInCents: 2000,
              productTitleSnapshot: 'Mouse Pro',
              productImageSnapshot: '/mouse.png',
            },
            {
              productId: 'product-2',
              quantity: 1,
              unitPriceInCents: 3000,
              lineTotalInCents: 3000,
              productTitleSnapshot: 'Keyboard Pro',
              productImageSnapshot: '/keyboard.png',
            },
          ],
        },
      },
      select: { id: true, totalPriceInCents: true, createdAt: true },
    });
  });
});
