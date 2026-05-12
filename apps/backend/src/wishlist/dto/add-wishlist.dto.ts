import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class AddWishlistDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
