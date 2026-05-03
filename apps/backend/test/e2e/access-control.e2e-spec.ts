import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Access Control (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const password = process.env['E2E_PASSWORD'] ?? 'E2e$Test1';
  const standardEmail = `user-e2e-${Date.now()}@example.com`;
  const adminEmail = `admin-e2e-${Date.now()}@example.com`;

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
    await prisma.loginAttempt.deleteMany({ where: { email: { in: [standardEmail, adminEmail] } } });
    await prisma.user.deleteMany({ where: { email: { in: [standardEmail, adminEmail] } } });
    await app.close();
  });

  it('rotte protette richiedono JWT', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
    await request(app.getHttpServer()).get('/bookmarks').expect(401);
  });

  it('utenti standard non possono leggere /users', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: standardEmail,
      password,
      firstName: 'Standard',
      lastName: 'User',
    });

    const signin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: standardEmail, password })
      .expect(200);

    const token = signin.body.access_token as string;
    expect(token).toBeTruthy();

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('admin puo accedere a /users', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: adminEmail,
      password,
      firstName: 'Admin',
      lastName: 'User',
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: { isAdmin: true },
    });

    const signin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: adminEmail, password })
      .expect(200);

    const token = signin.body.access_token as string;
    expect(token).toBeTruthy();

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
