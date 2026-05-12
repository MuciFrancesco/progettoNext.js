import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateProductReviewDto } from './dto/create-product-review.dto';
import type { UpdateProductReviewDto } from './dto/update-product-review.dto';

const CATEGORY_META: Record<
  ProductCategory,
  {
    readonly slug: string;
    readonly label: string;
    readonly heroTitle: string;
    readonly heroSubtitle: string;
    readonly heroImagePath: string;
  }
> = {
  TECHNOLOGY: {
    slug: 'tecnologia',
    label: 'Tecnologia',
    heroTitle: 'Tecnologia per lavorare, creare e giocare meglio',
    heroSubtitle: 'Dispositivi, accessori e setup selezionati con disponibilita aggiornata.',
    heroImagePath: '/uploads/thinkshop/heroes/tecnologia.svg',
  },
  HOME: {
    slug: 'casa',
    label: 'Casa',
    heroTitle: 'Soluzioni intelligenti per la casa quotidiana',
    heroSubtitle: 'Elettrodomestici, comfort e organizzazione per spazi piu semplici da vivere.',
    heroImagePath: '/uploads/thinkshop/heroes/casa.svg',
  },
  CLOTHING: {
    slug: 'abbigliamento',
    label: 'Abbigliamento',
    heroTitle: 'Capi essenziali con dettagli tecnici',
    heroSubtitle: 'Strati, scarpe e accessori scelti per ritmo urbano e movimento.',
    heroImagePath: '/uploads/thinkshop/heroes/abbigliamento.svg',
  },
  SPORTS: {
    slug: 'sport',
    label: 'Sport',
    heroTitle: 'Attrezzatura pronta per allenarsi davvero',
    heroSubtitle: 'Outdoor, running, training e accessori con stock verificato.',
    heroImagePath: '/uploads/thinkshop/heroes/sport.svg',
  },
  BOOKS: {
    slug: 'libri',
    label: 'Libri',
    heroTitle: 'Letture pratiche per imparare e progettare',
    heroSubtitle: 'Manuali, saggi e guide selezionate per studio, lavoro e curiosita.',
    heroImagePath: '/uploads/thinkshop/heroes/libri.svg',
  },
  FOOD: {
    slug: 'alimentari',
    label: 'Alimentari',
    heroTitle: 'Sapori curati per la dispensa moderna',
    heroSubtitle: 'Box, specialita e prodotti selezionati da mettere subito in tavola.',
    heroImagePath: '/uploads/thinkshop/heroes/alimentari.svg',
  },
  BEAUTY: {
    slug: 'bellezza',
    label: 'Bellezza',
    heroTitle: 'Routine essenziali per pelle, capelli e cura personale',
    heroSubtitle: 'Set e formule facili da scegliere, con disponibilita sempre controllata.',
    heroImagePath: '/uploads/thinkshop/heroes/bellezza.svg',
  },
  TOYS: {
    slug: 'giocattoli',
    label: 'Giocattoli',
    heroTitle: 'Giochi costruiti per esplorare, montare e inventare',
    heroSubtitle: 'Set creativi, STEM e costruzioni per eta e interessi diversi.',
    heroImagePath: '/uploads/thinkshop/heroes/giocattoli.svg',
  },
  OTHER: {
    slug: 'altro',
    label: 'Altro',
    heroTitle: 'Scelte utili fuori categoria',
    heroSubtitle: 'Accessori, idee regalo e soluzioni quotidiane selezionate da ThinkShop.',
    heroImagePath: '/uploads/thinkshop/heroes/altro.svg',
  },
};

function productCategoryFromSlug(slug: string): ProductCategory | undefined {
  return (Object.keys(CATEGORY_META) as ProductCategory[]).find(
    (category) => CATEGORY_META[category].slug === slug
  );
}

function productCategoriesMatchingSearch(query: string): ProductCategory[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return (Object.keys(CATEGORY_META) as ProductCategory[]).filter((category) => {
    const meta = CATEGORY_META[category];
    return (
      category.toLowerCase().includes(normalizedQuery) ||
      meta.slug.toLowerCase().includes(normalizedQuery) ||
      meta.label.toLowerCase().includes(normalizedQuery)
    );
  });
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly reviewInclude = {
    user: {
      select: {
        id: true,
        firstname: true,
        secondname: true,
        lastname: true,
      },
    },
  } as const;

  async listProducts(params: {
    categories?: ProductCategory[];
    subcategorySlug?: string;
    q?: string;
    page: number;
    limit: number;
  }) {
    const { categories, subcategorySlug, q, page, limit } = params;
    const where: Prisma.ProductWhereInput = {
      isAvailableForPurchase: true,
      stockQuantity: { gt: 0 },
    };

    if (categories?.length) {
      where.category = { in: categories };
    }

    if (subcategorySlug) {
      where.subcategory = { slug: subcategorySlug };
    }

    if (q) {
      const matchingCategories = productCategoriesMatchingSearch(q);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { subcategory: { label: { contains: q, mode: 'insensitive' } } },
        { subcategory: { slug: { contains: q, mode: 'insensitive' } } },
        ...(matchingCategories.length > 0 ? [{ category: { in: matchingCategories } }] : []),
      ];
    }

    const productSelect = {
      id: true,
      title: true,
      name: true,
      description: true,
      brand: true,
      imagePath: true,
      imagePaths: true,
      category: true,
      priceInCents: true,
      originalPriceInCents: true,
      isInSale: true,
      salePriceInCents: true,
      saleDiscountPercent: true,
      stockQuantity: true,
      isAvailableForPurchase: true,
      isRebuyable: true,
      createdAt: true,
      updatedAt: true,
      subcategory: {
        select: {
          id: true,
          category: true,
          slug: true,
          label: true,
          heroTitle: true,
          heroSubtitle: true,
          heroImagePath: true,
          sortOrder: true,
        },
      },
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

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        features: { orderBy: { sortOrder: 'asc' } },
        specifications: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Prodotto non trovato');
    }

    const reviews = await this.prisma.productReview.aggregate({
      where: { productId: id, status: 'PUBLISHED' },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      ...product,
      averageRating: reviews._avg.rating ?? 0,
      reviewCount: reviews._count.rating,
    };
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

  async listCatalogNavigation() {
    const visibleWhere = {
      isAvailableForPurchase: true,
      stockQuantity: { gt: 0 },
    } satisfies Prisma.ProductWhereInput;

    const [categoryCounts, subcategories] = await Promise.all([
      this.prisma.product.groupBy({
        by: ['category'],
        where: visibleWhere,
        _count: { _all: true },
      }),
      this.prisma.productSubcategory.findMany({
        orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { label: 'asc' }],
        include: {
          _count: {
            select: {
              products: { where: visibleWhere },
            },
          },
        },
      }),
    ]);

    const countsByCategory = new Map(
      categoryCounts.map((item) => [item.category, item._count._all])
    );

    const categories = (Object.keys(CATEGORY_META) as ProductCategory[])
      .filter((category) => (countsByCategory.get(category) ?? 0) > 0)
      .map((category) => {
        const meta = CATEGORY_META[category];
        return {
          category,
          ...meta,
          productCount: countsByCategory.get(category) ?? 0,
          subcategories: subcategories
            .filter((item) => item.category === category && item._count.products > 0)
            .map((item) => ({
              id: item.id,
              category: item.category,
              slug: item.slug,
              label: item.label,
              heroTitle: item.heroTitle,
              heroSubtitle: item.heroSubtitle,
              heroImagePath: item.heroImagePath,
              sortOrder: item.sortOrder,
              productCount: item._count.products,
            })),
        };
      });

    return {
      categories,
      heroSlides: categories.map((category) => ({
        category: category.category,
        slug: category.slug,
        label: category.label,
        title: category.heroTitle,
        subtitle: category.heroSubtitle,
        imagePath: category.heroImagePath,
      })),
    };
  }

  async getCategoryCatalog(slug: string, params: { subcategorySlug?: string; q?: string; page: number; limit: number }) {
    const category = productCategoryFromSlug(slug);
    if (!category) {
      throw new NotFoundException('Categoria non trovata');
    }

    const navigation = await this.listCatalogNavigation();
    const categoryMeta = navigation.categories.find((item) => item.category === category);
    if (!categoryMeta) {
      throw new NotFoundException('Categoria non disponibile');
    }

    const products = await this.listProducts({
      categories: [category],
      subcategorySlug: params.subcategorySlug,
      q: params.q,
      page: params.page,
      limit: params.limit,
    });

    return {
      category: categoryMeta,
      products,
    };
  }

  async listProductReviews(productId: string) {
    return this.prisma.productReview.findMany({
      where: { productId, status: 'PUBLISHED' },
      include: this.reviewInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProductReview(
    productId: string,
    userId: string,
    dto: CreateProductReviewDto
  ) {
    const verifiedPurchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      },
      select: { id: true },
    });

    try {
      return await this.prisma.productReview.create({
        data: {
          productId,
          userId,
          rating: dto.rating,
          title: dto.title,
          body: dto.body,
          status: 'PUBLISHED',
          isVerifiedPurchase: Boolean(verifiedPurchase),
        },
        include: this.reviewInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Hai gia recensito questo prodotto');
      }
      throw error;
    }
  }

  async updateMyProductReview(
    productId: string,
    userId: string,
    dto: UpdateProductReviewDto
  ) {
    const data: Prisma.ProductReviewUpdateInput = {};
    if (dto.rating !== undefined) data.rating = dto.rating;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.body !== undefined) data.body = dto.body;

    try {
      return await this.prisma.productReview.update({
        where: { userId_productId: { userId, productId } },
        data,
        include: this.reviewInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Recensione non trovata');
      }
      throw error;
    }
  }

  async hideProductReview(reviewId: string) {
    try {
      return await this.prisma.productReview.update({
        where: { id: reviewId },
        data: { status: 'HIDDEN' },
        include: this.reviewInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Recensione non trovata');
      }
      throw error;
    }
  }
}
