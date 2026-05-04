import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategory } from '@prisma/client';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkStatusStore } from './bulk-status.store';

describe('AdminService', () => {
  let service: AdminService;

  const prismaMock = {
    product: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        BulkStatusStore,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('reports bulk status as idle by default', () => {
    expect(service.getBulkStatus()).toEqual({ isBusy: false });
  });

  it('rejects bulk updates when no fields are provided', async () => {
    await expect(
      service.bulkUpdateProducts({
        ids: ['p1', 'p2'],
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sets and clears bulkBusy around bulk updates', async () => {
    prismaMock.product.update.mockImplementation(({ where }: { where: { id: string } }) => ({
      id: where.id,
      title: `product-${where.id}`,
    }));

    prismaMock.$transaction.mockImplementation(async (operations: Array<unknown>) => {
      expect(service.getBulkStatus()).toEqual({ isBusy: true });
      return operations;
    });

    const result = await service.bulkUpdateProducts({
      ids: ['p1', 'p2'],
      category: ProductCategory.BOOKS,
    });

    expect(result).toEqual([
      { id: 'p1', title: 'product-p1' },
      { id: 'p2', title: 'product-p2' },
    ]);
    expect(service.getBulkStatus()).toEqual({ isBusy: false });
    expect(prismaMock.product.update).toHaveBeenCalledTimes(2);
  });
});

