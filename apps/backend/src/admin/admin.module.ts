import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UploadController } from './upload.controller';
import { BulkStatusStore } from './bulk-status.store';

@Module({
  controllers: [AdminController, UploadController],
  providers: [AdminService, BulkStatusStore],
})
export class AdminModule {}
