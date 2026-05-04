import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductCategory } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  CreateUserDto,
  UpdateProductDto,
  UpdateUserRoleDto,
  BulkUpdateProductDto,
} from './dto';

type SimilarProduct = {
  id: string;
  title: string;
  name: string;
  imagePath: string;
  stockQuantity: number;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Replace with a DB flag or Redis entry — in-memory state breaks with multiple instances.
  private bulkBusy = false;

  getBulkStatus(): { isBusy: boolean } {
    return { isBusy: this.bulkBusy };
  }

  async bulkUpdateProducts(dto: BulkUpdateProductDto) {
    if (dto.category === undefined && dto.isAvailableForPurchase === undefined) {
      throw new BadRequestException('Nessun campo da aggiornare');
    }

    const data: { category?: ProductCategory; isAvailableForPurchase?: boolean } = {};
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.isAvailableForPurchase !== undefined)
      data.isAvailableForPurchase = dto.isAvailableForPurchase;

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

    this.bulkBusy = true;
    try {
      const updated = await this.prisma.$transaction(
        dto.ids.map((id) =>
          this.prisma.product.update({ where: { id }, data, select: productSelect })
        )
      );
      return updated;
    } finally {
      this.bulkBusy = false;
    }
  }

  async listUsers(params: { email?: string; name?: string; page: number; limit: number }) {
    const { email, name, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (name) {
      where.OR = [
        { firstname: { contains: name, mode: 'insensitive' } },
        { lastname: { contains: name, mode: 'insensitive' } },
        { secondname: { contains: name, mode: 'insensitive' } },
      ];
    }

    const userSelect = {
      id: true,
      email: true,
      firstname: true,
      secondname: true,
      lastname: true,
      isAdmin: true,
      isEmployee: true,
      canCreateCart: true,
      canOrderProducts: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async createUser(dto: CreateUserDto) {
    const hash = await argon.hash(dto.password);
    try {
      const isAdmin = dto.isAdmin ?? false;
      const isEmployee = isAdmin ? false : (dto.isEmployee ?? false);
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstname: dto.firstName,
          lastname: dto.lastName,
          isAdmin,
          isEmployee,
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          secondname: true,
          lastname: true,
          isAdmin: true,
          isEmployee: true,
          canCreateCart: true,
          canOrderProducts: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email già in uso');
      }
      throw error;
    }
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    if (
      dto.isAdmin === undefined &&
      dto.isEmployee === undefined &&
      dto.canCreateCart === undefined &&
      dto.canOrderProducts === undefined
    ) {
      throw new BadRequestException('Nessun campo ruolo da aggiornare');
    }

    // isAdmin and isEmployee are mutually exclusive: promoting to admin clears employee flag.
    const data: {
      isAdmin?: boolean;
      isEmployee?: boolean;
      canCreateCart?: boolean;
      canOrderProducts?: boolean;
    } = {};
    if (dto.isAdmin !== undefined) {
      data.isAdmin = dto.isAdmin;
      if (dto.isAdmin) data.isEmployee = false;
    }
    if (dto.isEmployee !== undefined && !data.isAdmin) {
      data.isEmployee = dto.isEmployee;
      if (dto.isEmployee) data.isAdmin = false;
    }
    if (dto.canCreateCart !== undefined) data.canCreateCart = dto.canCreateCart;
    if (dto.canOrderProducts !== undefined) data.canOrderProducts = dto.canOrderProducts;

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          email: true,
          firstname: true,
          secondname: true,
          lastname: true,
          isAdmin: true,
          isEmployee: true,
          canCreateCart: true,
          canOrderProducts: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch {
      throw new NotFoundException('Utente non trovato');
    }
  }

  async deleteUsers(ids: string[], callerId: string) {
    if (ids.includes(callerId)) {
      throw new BadRequestException('Non puoi eliminare il tuo stesso account');
    }
    const { count } = await this.prisma.user.deleteMany({
      where: { id: { in: ids } },
    });
    if (count === 0) {
      throw new NotFoundException('Nessun utente trovato');
    }
    return { count };
  }

  async listProducts(params: {
    categories?: ProductCategory[];
    title?: string;
    name?: string;
    page: number;
    limit: number;
  }) {
    const { categories, title, name, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (categories && categories.length > 0) {
      where.category = { in: categories };
    }
    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
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
        skip,
        take: limit,
        select: productSelect,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async listOrdersPaginated(
    page: number,
    limit: number,
    filter: 'today' | 'week' | 'month' | 'year' | 'all'
  ): Promise<{ data: unknown[]; total: number; totalRevenue: number; grandTotalRevenue: number }> {
    const now = new Date();
    let dateGte: Date | undefined;

    if (filter === 'today') {
      dateGte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === 'week') {
      const diffToMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
      dateGte = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
    } else if (filter === 'month') {
      dateGte = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === 'year') {
      dateGte = new Date(now.getFullYear(), 0, 1);
    }

    const where = dateGte ? { createdAt: { gte: dateGte } } : {};

    const orderSelect = {
      id: true,
      totalPriceInCents: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstname: true,
          secondname: true,
          lastname: true,
        },
      },
      product: {
        select: {
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
        },
      },
    } as const;

    const [data, total, aggregate, grandAggregate] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        select: orderSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({ where, _sum: { totalPriceInCents: true } }),
      this.prisma.order.aggregate({ where: {}, _sum: { totalPriceInCents: true } }),
    ]);

    return {
      data,
      total,
      totalRevenue:
        (aggregate as { _sum: { totalPriceInCents: number | null } })._sum.totalPriceInCents ?? 0,
      grandTotalRevenue:
        (grandAggregate as { _sum: { totalPriceInCents: number | null } })._sum.totalPriceInCents ??
        0,
    };
  }

  async checkSimilarProducts(input: {
    title: string;
    name: string;
    imagePath: string;
  }): Promise<SimilarProduct[]> {
    const imagePath = input.imagePath.trim();

    // Tokenise: split on non-word characters, keep only tokens with >= 4 chars.
    // This prevents short noise strings like "asa" from matching words like "casa".
    const tokenise = (str: string): string[] =>
      str
        .trim()
        .toLowerCase()
        .split(/\W+/)
        .filter((t) => t.length >= 4);

    const titleTokens = tokenise(input.title);
    const nameTokens = tokenise(input.name);
    const allTokens = [...new Set([...titleTokens, ...nameTokens])];

    // If no meaningful tokens and no exact imagePath, nothing to match on.
    if (allTokens.length === 0 && !imagePath) {
      return [];
    }

    const orConditions: Prisma.ProductWhereInput[] = [];

    for (const token of allTokens) {
      orConditions.push({ title: { contains: token, mode: 'insensitive' } });
      orConditions.push({ name: { contains: token, mode: 'insensitive' } });
    }

    if (imagePath) {
      orConditions.push({ imagePath: { equals: imagePath, mode: 'insensitive' } });
    }

    const candidates = await this.prisma.product.findMany({
      where: { OR: orConditions },
      select: {
        id: true,
        title: true,
        name: true,
        imagePath: true,
        stockQuantity: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return candidates;
  }

  async createProduct(dto: CreateProductDto) {
    // imagePath is the primary image; fall back to first of imagePaths if somehow empty.
    const primaryImagePath = dto.imagePath?.trim() || dto.imagePaths?.[0]?.trim() || '';

    const similarProducts = await this.checkSimilarProducts({
      title: dto.title,
      name: dto.name,
      imagePath: primaryImagePath,
    });

    if (similarProducts.length > 0 && !dto.forceConfirm) {
      return {
        created: false,
        requiresConfirmation: true,
        similarProducts,
      };
    }

    const product = await this.prisma.product.create({
      data: {
        title: dto.title.trim(),
        name: dto.name.trim(),
        description: dto.description.trim(),
        imagePath: primaryImagePath,
        imagePaths: dto.imagePaths ?? (primaryImagePath ? [primaryImagePath] : []),
        priceInCents: dto.priceInCents ?? 0,
        stockQuantity: dto.stockQuantity,
        isAvailableForPurchase: dto.stockQuantity > 0,
        category: dto.category,
      },
      select: {
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
      },
    });

    return {
      created: true,
      requiresConfirmation: false,
      similarProducts,
      product,
    };
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    if (
      dto.title === undefined &&
      dto.name === undefined &&
      dto.description === undefined &&
      dto.imagePath === undefined &&
      dto.imagePaths === undefined &&
      dto.priceInCents === undefined &&
      dto.stockQuantity === undefined &&
      dto.isAvailableForPurchase === undefined &&
      dto.category === undefined
    ) {
      throw new BadRequestException('Nessun campo prodotto da aggiornare');
    }

    const data: {
      title?: string;
      name?: string;
      description?: string;
      imagePath?: string;
      imagePaths?: string[];
      priceInCents?: number;
      stockQuantity?: number;
      isAvailableForPurchase?: boolean;
      category?: ProductCategory;
    } = {};

    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.description !== undefined) data.description = dto.description.trim();
    if (dto.imagePath !== undefined) data.imagePath = dto.imagePath.trim();
    if (dto.imagePaths !== undefined) data.imagePaths = dto.imagePaths;
    if (dto.priceInCents !== undefined) data.priceInCents = dto.priceInCents;
    if (dto.stockQuantity !== undefined) {
      data.stockQuantity = dto.stockQuantity;
      if (dto.isAvailableForPurchase === undefined) {
        data.isAvailableForPurchase = dto.stockQuantity > 0;
      }
    }
    if (dto.isAvailableForPurchase !== undefined) {
      data.isAvailableForPurchase = dto.isAvailableForPurchase;
    }
    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data,
        select: {
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
        },
      });
    } catch {
      throw new NotFoundException('Prodotto non trovato');
    }
  }

  async bulkDeleteProducts(ids: string[]): Promise<{ count: number }> {
    return await this.prisma.$transaction(async (tx) => {
      // Order ha onDelete: Restrict — va eliminato prima dei prodotti
      await tx.order.deleteMany({ where: { productId: { in: ids } } });
      const { count } = await tx.product.deleteMany({ where: { id: { in: ids } } });
      return { count };
    });
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true },
    });
    if (!product) throw new NotFoundException('Prodotto non trovato');

    return await this.prisma.$transaction(async (tx) => {
      // Order ha onDelete: Restrict — va eliminato prima del prodotto
      await tx.order.deleteMany({ where: { productId } });
      return await tx.product.delete({
        where: { id: productId },
        select: { id: true, title: true },
      });
    });
  }
}
