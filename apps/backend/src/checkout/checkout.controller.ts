import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CheckoutService } from './checkout.service';
import { CheckoutItemsDto } from './dto/checkout-item.dto';

@UseGuards(JwtGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('payment-intent')
  @HttpCode(HttpStatus.OK)
  createPaymentIntent(@Body() dto: CheckoutItemsDto) {
    return this.checkoutService.createPaymentIntent(dto.items);
  }

  @Post('paypal/order')
  @HttpCode(HttpStatus.OK)
  createPayPalOrder(@Body() dto: CheckoutItemsDto) {
    return this.checkoutService.createPayPalOrder(dto.items);
  }

  @Post('capture')
  @HttpCode(HttpStatus.OK)
  capture(@GetUser('id') userId: string, @Body() dto: CheckoutItemsDto) {
    return this.checkoutService.captureOrder(userId, dto.items);
  }
}
