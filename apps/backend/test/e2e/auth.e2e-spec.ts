import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const password = process.env['E2E_PASSWORD'] ?? 'E2e$Test1';
  const email = `auth-e2e-${Date.now()}@example.com`;

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
    await prisma.loginAttempt.deleteMany({ where: { email } });
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('signup/signin happy path', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password, firstName: 'E2E', lastName: 'User' })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeTruthy();
      });

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeTruthy();
      });
  });

  it('login con tentativi falliti: warning e poi blocco', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(403);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(403);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(200)
      .expect((res) => {
        expect(res.body.remainingAttempts).toBe(2);
        expect(res.body.isBlocked).toBe(false);
      });

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(200)
      .expect((res) => {
        expect(res.body.remainingAttempts).toBe(1);
        expect(res.body.isBlocked).toBe(false);
      });

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(200)
      .expect((res) => {
        expect(res.body.remainingAttempts).toBe(0);
        expect(res.body.isBlocked).toBe(true);
      });

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'Wrong$Pass1' })
      .expect(403);
  });

  it('mass assignment hardening: signup rifiuta isAdmin', async () => {
    const secondEmail = `auth-e2e-admin-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: secondEmail,
        password,
        firstName: 'Not',
        lastName: 'Admin',
        isAdmin: true,
      })
      .expect(400);

    const user = await prisma.user.findUnique({ where: { email: secondEmail } });
    expect(user).toBeNull();
  });
});
