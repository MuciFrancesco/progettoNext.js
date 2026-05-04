import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductCategory } from '@prisma/client';

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

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  priceInCents?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isAvailableForPurchase?: boolean;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;
}
