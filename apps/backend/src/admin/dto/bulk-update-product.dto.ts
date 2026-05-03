import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class BulkUpdateProductDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  ids!: string[];

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsBoolean()
  @IsOptional()
  isAvailableForPurchase?: boolean;
}
