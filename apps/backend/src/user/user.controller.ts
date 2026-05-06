import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateLocaleDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@GetUser('isAdmin') isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can view all users');
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        secondname: true,
        lastname: true,
        isAdmin: true,
        canCreateCart: true,
        canOrderProducts: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: unknown) {
    return user;
  }

  @Patch('me/locale')
  @HttpCode(HttpStatus.OK)
  updateMyLocale(@GetUser('id') userId: string, @Body() dto: UpdateLocaleDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { preferredLocale: dto.locale },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        preferredLocale: true,
        isAdmin: true,
      },
    });
  }

  @Get('me/orders')
  @HttpCode(HttpStatus.OK)
  async listMyOrders(
    @GetUser('id') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('filter') filter = 'all'
  ) {
    const pageNum = Math.max(1, Number.parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();
    let dateFilter: { gte: Date } | undefined;
    if (filter === 'today') {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      dateFilter = { gte: start };
    } else if (filter === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      dateFilter = { gte: start };
    } else if (filter === 'month') {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      dateFilter = { gte: start };
    } else if (filter === 'year') {
      const start = new Date(now);
      start.setFullYear(now.getFullYear() - 1);
      dateFilter = { gte: start };
    }

    const where = {
      userId,
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    };

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
      items: {
        select: {
          id: true,
          quantity: true,
          unitPriceInCents: true,
          lineTotalInCents: true,
          productTitleSnapshot: true,
          productImageSnapshot: true,
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
        },
      },
    } as const;

    const [data, total, aggregate, grandAggregate] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        select: orderSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({ where, _sum: { totalPriceInCents: true } }),
      this.prisma.order.aggregate({ where: { userId }, _sum: { totalPriceInCents: true } }),
    ]);

    const totalRevenue =
      (aggregate as { _sum: { totalPriceInCents: number | null } })._sum.totalPriceInCents ?? 0;
    const grandTotalRevenue =
      (grandAggregate as { _sum: { totalPriceInCents: number | null } })._sum.totalPriceInCents ??
      0;

    return { data, total, totalRevenue, grandTotalRevenue };
  }
}
