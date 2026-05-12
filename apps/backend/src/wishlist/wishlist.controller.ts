import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getWishlist(@GetUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addToWishlist(@GetUser('id') userId: string, @Body() dto: AddWishlistDto) {
    return this.wishlistService.addToWishlist(userId, dto);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromWishlist(@GetUser('id') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
