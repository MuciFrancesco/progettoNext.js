import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [AdminController, UploadController],
  providers: [AdminService],
})
export class AdminModule {}
