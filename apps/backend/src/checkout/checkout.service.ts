import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CheckoutItemDto } from './dto/checkout-item.dto';

type ValidatedCheckout = {
  readonly totalInCents: number;
  readonly items: Array<{
    readonly productId: string;
    readonly quantity: number;
    readonly unitPriceInCents: number;
    readonly title: string;
    readonly imagePath: string | null;
  }>;
};

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async validateItems(items: CheckoutItemDto[]): Promise<ValidatedCheckout> {
    if (!items.length) {
      throw new BadRequestException('Il carrello è vuoto');
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: [...quantities.keys()] } },
      select: {
        id: true,
        title: true,
        imagePath: true,
        imagePaths: true,
        priceInCents: true,
        stockQuantity: true,
        isAvailableForPurchase: true,
      },
    });

    if (products.length !== quantities.size) {
      throw new BadRequestException('Uno o più prodotti non sono disponibili');
    }

    const validatedItems = products.map((product) => {
      const quantity = quantities.get(product.id) ?? 0;
      if (!product.isAvailableForPurchase || product.stockQuantity < quantity) {
        throw new BadRequestException('Stock insufficiente o prodotto non acquistabile');
      }
      return {
        productId: product.id,
        quantity,
        unitPriceInCents: product.priceInCents,
        title: product.title,
        imagePath: product.imagePaths[0] ?? product.imagePath ?? null,
      };
    });

    const totalInCents = validatedItems.reduce(
      (sum, item) => sum + item.unitPriceInCents * item.quantity,
      0
    );

    return { items: validatedItems, totalInCents };
  }

  async createPaymentIntent(items: CheckoutItemDto[]) {
    const checkout = await this.validateItems(items);
    return {
      amount: checkout.totalInCents,
      currency: 'eur',
      mode: process.env.STRIPE_SECRET_KEY ? 'stripe' : 'demo',
      clientSecret: process.env.STRIPE_SECRET_KEY
        ? `requires-stripe-sdk-${randomUUID()}`
        : `demo-${randomUUID()}`,
    };
  }

  async createPayPalOrder(items: CheckoutItemDto[]) {
    const checkout = await this.validateItems(items);
    return {
      id: `paypal-demo-${randomUUID()}`,
      amount: checkout.totalInCents,
      currency: 'EUR',
      mode: process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET ? 'paypal' : 'demo',
    };
  }

  async captureOrder(userId: string, items: CheckoutItemDto[]) {
    const checkout = await this.validateItems(items);

    const order = await this.prisma.$transaction(async (tx) => {
      for (const item of checkout.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          userId,
          status: 'PAID',
          totalPriceInCents: checkout.totalInCents,
          items: {
            create: checkout.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceInCents: item.unitPriceInCents,
              lineTotalInCents: item.unitPriceInCents * item.quantity,
              productTitleSnapshot: item.title,
              productImageSnapshot: item.imagePath,
            })),
          },
        },
        select: { id: true, totalPriceInCents: true, createdAt: true },
      });
    });

    return {
      order,
      totalInCents: checkout.totalInCents,
    };
  }
}
