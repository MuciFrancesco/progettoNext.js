import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductCategory } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listProducts(
    @Query('categories') categories?: string,
    @Query('subcategory') subcategorySlug?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.productService.listProducts({
      categories: categories
        ? (categories.split(',').filter(Boolean) as ProductCategory[])
          : undefined,
      subcategorySlug: subcategorySlug || undefined,
      q: q || undefined,
      page: page ? Math.max(1, Number.parseInt(page, 10) || 1) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20)) : 20,
    });
  }

  @Get('catalog/navigation')
  @HttpCode(HttpStatus.OK)
  listCatalogNavigation() {
    return this.productService.listCatalogNavigation();
  }

  @Get('categories/:slug')
  @HttpCode(HttpStatus.OK)
  getCategoryCatalog(
    @Param('slug') slug: string,
    @Query('subcategory') subcategorySlug?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.productService.getCategoryCatalog(slug, {
      subcategorySlug: subcategorySlug || undefined,
      q: q || undefined,
      page: page ? Math.max(1, Number.parseInt(page, 10) || 1) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20)) : 60,
    });
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  getProductStatuses(@Query('ids') ids?: string) {
    return this.productService.getProductStatuses(
      ids
        ? ids
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : []
    );
  }

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Get(':productId/reviews')
  @HttpCode(HttpStatus.OK)
  listProductReviews(@Param('productId') productId: string) {
    return this.productService.listProductReviews(productId);
  }

  @Post(':productId/reviews')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createProductReview(
    @Param('productId') productId: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateProductReviewDto
  ) {
    return this.productService.createProductReview(productId, userId, dto);
  }

  @Patch(':productId/reviews/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateMyProductReview(
    @Param('productId') productId: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateProductReviewDto
  ) {
    return this.productService.updateMyProductReview(productId, userId, dto);
  }
}
