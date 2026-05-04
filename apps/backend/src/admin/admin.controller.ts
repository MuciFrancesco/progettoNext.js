import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AdminGuard, AdminOrEmployeeGuard, JwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import {
  CreateProductDto,
  CreateUserDto,
  DeleteUsersDto,
  UpdateProductDto,
  UpdateUserRoleDto,
  BulkUpdateProductDto,
  BulkDeleteProductDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  listUsers(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.adminService.listUsers({
      email: email || undefined,
      name: name || undefined,
      page: page ? Number.parseInt(page, 10) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10))) : 20,
    });
  }

  @Patch('users/:userId/role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  updateUserRole(@Param('userId') userId: string, @Body() dto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(userId, dto);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Delete('users/bulk')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  deleteUsers(@GetUser('id') callerId: string, @Body() dto: DeleteUsersDto) {
    return this.adminService.deleteUsers(dto.ids, callerId);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  listProducts(
    @Query('categories') categories?: string,
    @Query('title') title?: string,
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.adminService.listProducts({
      categories: categories
        ? (categories.split(',').filter(Boolean) as import('@prisma/client').ProductCategory[])
        : undefined,
      title: title || undefined,
      name: name || undefined,
      page: page ? Number.parseInt(page, 10) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10))) : 20,
    });
  }

  @Post('products')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Get('products/bulk-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  getBulkStatus() {
    return this.adminService.getBulkStatus();
  }

  @Patch('products/bulk')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  bulkUpdateProducts(@Body() dto: BulkUpdateProductDto) {
    return this.adminService.bulkUpdateProducts(dto);
  }

  @Patch('products/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  updateProduct(@Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(productId, dto);
  }

  @Delete('products/bulk')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  bulkDeleteProducts(@Body() dto: BulkDeleteProductDto) {
    return this.adminService.bulkDeleteProducts(dto.ids);
  }

  @Delete('products/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminOrEmployeeGuard)
  deleteProduct(@Param('productId') productId: string) {
    return this.adminService.deleteProduct(productId);
  }

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  listOrders(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('filter') filter = 'all'
  ) {
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const validFilter = ['today', 'week', 'month', 'year', 'all'].includes(filter)
      ? (filter as 'today' | 'week' | 'month' | 'year' | 'all')
      : 'all';
    return this.adminService.listOrdersPaginated(pageNum, limitNum, validFilter);
  }
}
