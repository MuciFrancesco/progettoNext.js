import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('User locale (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const password = process.env['E2E_PASSWORD'] ?? 'E2e$Test1';
  const email = `locale-e2e-${Date.now()}@example.com`;

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

  it('richiede autenticazione', async () => {
    await request(app.getHttpServer()).patch('/users/me/locale').send({ locale: 'fr' }).expect(401);
  });

  it('aggiorna e persiste una locale valida', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      password,
      firstName: 'Locale',
      lastName: 'User',
    });

    const signin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(200);

    const token = signin.body.access_token as string;

    await request(app.getHttpServer())
      .patch('/users/me/locale')
      .set('Authorization', `Bearer ${token}`)
      .send({ locale: 'fr' })
      .expect(200)
      .expect((res) => {
        expect(res.body.preferredLocale).toBe('fr');
      });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { preferredLocale: true },
    });
    expect(user?.preferredLocale).toBe('fr');
  });

  it('rifiuta locale non supportata o payload malformati', async () => {
    const signin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(200);

    const token = signin.body.access_token as string;

    await request(app.getHttpServer())
      .patch('/users/me/locale')
      .set('Authorization', `Bearer ${token}`)
      .send({ locale: 'jp' })
      .expect(400);

    await request(app.getHttpServer())
      .patch('/users/me/locale')
      .set('Authorization', `Bearer ${token}`)
      .send({ locale: 42 })
      .expect(400);
  });
});
