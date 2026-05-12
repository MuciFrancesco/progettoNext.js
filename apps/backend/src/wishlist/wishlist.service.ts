import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWishlistDto } from './dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWishlist(userId: string, dto: AddWishlistDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Prodotto non trovato');

    return this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      update: { quantity: dto.quantity },
      create: { userId, productId: dto.productId, quantity: dto.quantity },
      include: { product: true },
    });
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const entry = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!entry) throw new NotFoundException('Preferito non trovato');

    await this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
}
