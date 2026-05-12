import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductCategory } from '@prisma/client';
import {
  ProductFeatureInputDto,
  ProductImageInputDto,
  ProductSpecificationInputDto,
} from './create-product.dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  imagePath?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagePaths?: string[];

  @IsString()
  @MaxLength(120)
  @IsOptional()
  brand?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  priceInCents?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  originalPriceInCents?: number;

  @IsBoolean()
  @IsOptional()
  isInSale?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  salePriceInCents?: number | null;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  saleDiscountPercent?: number | null;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isAvailableForPurchase?: boolean;

  @IsBoolean()
  @IsOptional()
  isRebuyable?: boolean;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageInputDto)
  @IsOptional()
  images?: ProductImageInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductFeatureInputDto)
  @IsOptional()
  features?: ProductFeatureInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationInputDto)
  @IsOptional()
  specifications?: ProductSpecificationInputDto[];
}
