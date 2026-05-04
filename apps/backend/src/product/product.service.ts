import { Injectable } from '@nestjs/common';
import { Prisma, ProductCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(params: {
    categories?: ProductCategory[];
    q?: string;
    page: number;
    limit: number;
  }) {
    const { categories, q, page, limit } = params;
    const where: Prisma.ProductWhereInput = {
      isAvailableForPurchase: true,
      stockQuantity: { gt: 0 },
    };

    if (categories?.length) {
      where.category = { in: categories };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const productSelect = {
      id: true,
      title: true,
      name: true,
      description: true,
      imagePath: true,
      imagePaths: true,
      category: true,
      priceInCents: true,
      stockQuantity: true,
      isAvailableForPurchase: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: productSelect,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async getProductStatuses(ids: string[]) {
    if (ids.length === 0) return [];

    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        stockQuantity: true,
        isAvailableForPurchase: true,
      },
    });
  }
}
