import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listProducts(
    @Query('categories') categories?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.productService.listProducts({
      categories: categories
        ? (categories.split(',').filter(Boolean) as ProductCategory[])
        : undefined,
      q: q || undefined,
      page: page ? Math.max(1, Number.parseInt(page, 10) || 1) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20)) : 20,
    });
  }
}
