import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { JwtGuard } from 'src/auth/guard';
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

  private assertAdmin(isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException('Solo admin');
    }
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  listUsers(
    @GetUser('isAdmin') isAdmin: boolean,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    this.assertAdmin(isAdmin);
    return this.adminService.listUsers({
      email: email || undefined,
      name: name || undefined,
      page: page ? Number.parseInt(page, 10) : 1,
      limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10))) : 20,
    });
  }

  @Patch('users/:userId/role')
  @HttpCode(HttpStatus.OK)
  updateUserRole(
    @GetUser('isAdmin') isAdmin: boolean,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDto
  ) {
    this.assertAdmin(isAdmin);
    return this.adminService.updateUserRole(userId, dto);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@GetUser('isAdmin') isAdmin: boolean, @Body() dto: CreateUserDto) {
    this.assertAdmin(isAdmin);
    return this.adminService.createUser(dto);
  }

  @Delete('users/bulk')
  @HttpCode(HttpStatus.OK)
  deleteUsers(
    @GetUser('id') callerId: string,
    @GetUser('isAdmin') isAdmin: boolean,
    @Body() dto: DeleteUsersDto
  ) {
    this.assertAdmin(isAdmin);
    return this.adminService.deleteUsers(dto.ids, callerId);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  listProducts(
    @GetUser('isAdmin') isAdmin: boolean,
    @Query('categories') categories?: string,
    @Query('title') title?: string,
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    this.assertAdmin(isAdmin);
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
  createProduct(@GetUser('isAdmin') isAdmin: boolean, @Body() dto: CreateProductDto) {
    this.assertAdmin(isAdmin);
    return this.adminService.createProduct(dto);
  }

  @Get('products/bulk-status')
  @HttpCode(HttpStatus.OK)
  getBulkStatus(@GetUser('isAdmin') isAdmin: boolean) {
    this.assertAdmin(isAdmin);
    return this.adminService.getBulkStatus();
  }

  @Patch('products/bulk')
  @HttpCode(HttpStatus.OK)
  bulkUpdateProducts(@GetUser('isAdmin') isAdmin: boolean, @Body() dto: BulkUpdateProductDto) {
    this.assertAdmin(isAdmin);
    return this.adminService.bulkUpdateProducts(dto);
  }

  @Patch('products/:productId')
  @HttpCode(HttpStatus.OK)
  updateProduct(
    @GetUser('isAdmin') isAdmin: boolean,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto
  ) {
    this.assertAdmin(isAdmin);
    return this.adminService.updateProduct(productId, dto);
  }

  @Delete('products/bulk')
  @HttpCode(HttpStatus.OK)
  bulkDeleteProducts(@GetUser('isAdmin') isAdmin: boolean, @Body() dto: BulkDeleteProductDto) {
    this.assertAdmin(isAdmin);
    return this.adminService.bulkDeleteProducts(dto.ids);
  }

  @Delete('products/:productId')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@GetUser('isAdmin') isAdmin: boolean, @Param('productId') productId: string) {
    this.assertAdmin(isAdmin);
    return this.adminService.deleteProduct(productId);
  }

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  listOrders(
    @GetUser('isAdmin') isAdmin: boolean,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('filter') filter = 'all'
  ) {
    this.assertAdmin(isAdmin);
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const validFilter = ['today', 'week', 'month', 'year', 'all'].includes(filter)
      ? (filter as 'today' | 'week' | 'month' | 'year' | 'all')
      : 'all';
    return this.adminService.listOrdersPaginated(pageNum, limitNum, validFilter);
  }
}
