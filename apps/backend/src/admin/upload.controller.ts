import {
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { readFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/** Magic bytes signatures for image formats */
const MAGIC_BYTES: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

function validateMagicBytes(filePath: string, declaredMime: string): boolean {
  try {
    const buffer = readFileSync(filePath);
    if (buffer.length < 4) return false;

    const matched = MAGIC_BYTES.find((sig) => sig.bytes.every((b, i) => buffer[i] === b));

    if (!matched) return false;

    // For JPEG, the declared MIME can be image/jpeg
    if (declaredMime === 'image/jpeg' && matched.mime === 'image/jpeg') return true;
    if (declaredMime === matched.mime) return true;

    // WEBP sits inside a RIFF container — check for WEBP marker at offset 8
    if (declaredMime === 'image/webp' && matched.mime === 'image/webp') {
      return (
        buffer.length >= 12 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
      );
    }

    return false;
  } catch {
    return false;
  }
}

@UseGuards(JwtGuard)
@Controller('admin')
export class UploadController {
  private assertAdmin(isAdmin: boolean) {
    if (!isAdmin) {
      throw new ForbiddenException('Solo admin');
    }
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination(_req, _file, cb) {
          if (!existsSync(UPLOAD_DIR)) {
            mkdirSync(UPLOAD_DIR, { recursive: true });
          }
          cb(null, UPLOAD_DIR);
        },
        filename(_req, file, cb) {
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter(_req, file, cb) {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
          return cb(
            new BadRequestException(
              'Tipo file non consentito. Formati ammessi: JPG, PNG, WEBP, GIF.'
            ),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  uploadProductImage(
    @GetUser('isAdmin') isAdmin: boolean,
    @UploadedFile() file: Express.Multer.File
  ) {
    this.assertAdmin(isAdmin);

    if (!file) {
      throw new BadRequestException('Nessun file caricato.');
    }

    // Validate magic bytes to prevent MIME spoofing
    const filePath = join(UPLOAD_DIR, file.filename);
    if (!validateMagicBytes(filePath, file.mimetype)) {
      // Delete the spoofed file immediately
      try {
        unlinkSync(filePath);
      } catch {
        // ignore cleanup errors
      }
      throw new BadRequestException('Il contenuto del file non corrisponde al tipo dichiarato.');
    }

    return {
      imagePath: `/uploads/products/${file.filename}`,
    };
  }
}
