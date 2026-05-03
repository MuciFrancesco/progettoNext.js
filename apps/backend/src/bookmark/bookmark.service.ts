import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } });

    if (!bookmark) throw new NotFoundException('Bookmark non trovato');
    if (bookmark.userId !== userId) throw new ForbiddenException();

    return bookmark;
  }

  createBookmark(userId: string, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({ data: { ...dto, userId } });
  }

  async updateBookmark(userId: string, bookmarkId: string, dto: UpdateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } });

    if (!bookmark) throw new NotFoundException('Bookmark non trovato');
    if (bookmark.userId !== userId) throw new ForbiddenException();

    return this.prisma.bookmark.update({ where: { id: bookmarkId }, data: dto });
  }

  async deleteBookmark(userId: string, bookmarkId: string): Promise<void> {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } });

    if (!bookmark) throw new NotFoundException('Bookmark non trovato');
    if (bookmark.userId !== userId) throw new ForbiddenException();

    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }
}
