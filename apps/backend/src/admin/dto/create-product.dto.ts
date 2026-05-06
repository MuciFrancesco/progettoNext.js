import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class ProductImageInputDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url!: string;

  @IsString()
  @MaxLength(180)
  @IsOptional()
  altText?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class ProductFeatureInputDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ProductSpecificationInputDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  value!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imagePath!: string;

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

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsBoolean()
  @IsOptional()
  forceConfirm?: boolean;

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
