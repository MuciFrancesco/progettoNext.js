import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { describe } from 'node:test';

describe('Bookmark ownership (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const password = process.env['E2E_PASSWORD'] ?? 'E2e$Test1';
  const createdEmails: string[] = [];

  async function signUpAndToken(email: string) {
    createdEmails.push(email);
    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      password,
      firstName: 'Bookmark',
      lastName: 'User',
    });

    const signin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(200);

    return signin.body.access_token as string;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.bookmark.deleteMany({
      where: {
        user: { email: { in: createdEmails } },
      },
    });
    await prisma.loginAttempt.deleteMany({
      where: { email: { in: createdEmails } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: createdEmails } },
    });
    await app.close();
  });

  it('permette CRUD completo al proprietario', async () => {
    const ownerEmail = `bookmark-owner-crud-${Date.now()}@example.com`;
    const ownerToken = await signUpAndToken(ownerEmail);

    const create = await request(app.getHttpServer())
      .post('/bookmarks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Docs',
        description: 'Useful docs',
        link: 'https://example.com/docs',
      })
      .expect(201);

    const bookmarkId = create.body.id as string;
    expect(bookmarkId).toBeTruthy();

    await request(app.getHttpServer())
      .get('/bookmarks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((bookmark: { id: string }) => bookmark.id === bookmarkId)).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Updated docs' })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Updated docs');
      });

    await request(app.getHttpServer())
      .delete(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(204);
  });

  it('nega accesso cross-user su read, update e delete per prevenire IDOR', async () => {
    const ownerEmail = `bookmark-owner-idor-${Date.now()}@example.com`;
    const otherEmail = `bookmark-other-idor-${Date.now()}@example.com`;
    const ownerToken = await signUpAndToken(ownerEmail);
    const otherToken = await signUpAndToken(otherEmail);

    const create = await request(app.getHttpServer())
      .post('/bookmarks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Private bookmark',
        description: 'Owner only',
        link: 'https://example.com/private',
      })
      .expect(201);

    const bookmarkId = create.body.id as string;

    await request(app.getHttpServer())
      .get(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' })
      .expect(403);

    await request(app.getHttpServer())
      .delete(`/bookmarks/${bookmarkId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });
});
