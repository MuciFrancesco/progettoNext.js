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
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getBookmarkById(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBookmark(@GetUser('id') userId: string, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateBookmark(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmark(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
