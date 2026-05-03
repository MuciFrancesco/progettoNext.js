import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { MailerService } from './mailer.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
  };

  const jwtMock = {
    signAsync: jest.fn(),
  };

  const configMock = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
  };

  const mailerMock = {
    sendPhishingAlert: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
        { provide: MailerService, useValue: mailerMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('signup ignora qualsiasi tentativo di impostare privilegi admin', async () => {
    (argon.hash as jest.Mock).mockResolvedValue('hashed-password');
    prismaMock.user.create.mockResolvedValue({
      id: 'u1',
      email: 'user@example.com',
      preferredLocale: 'it',
      isAdmin: false,
    });
    jwtMock.signAsync.mockResolvedValue('jwt-token');

    await service.signup({
      email: 'user@example.com',
      password: 'Strong$Pass1',
      firstName: 'Mario',
      lastName: 'Rossi',
    } as never);

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isAdmin: false,
        }),
      })
    );
  });

  it('signin restituisce warning con remainingAttempts al superamento soglia', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 3 }]);

    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@example.com',
      hash: 'stored-hash',
      preferredLocale: 'it',
      isAdmin: false,
    });

    (argon.verify as jest.Mock).mockResolvedValue(false);

    const result = await service.signin({
      email: 'user@example.com',
      password: 'Wrong$Pass1',
      userAgent: 'jest-agent',
    });

    expect(result).toEqual({
      access_token: '',
      remainingAttempts: 2,
      isBlocked: false,
    });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1);
  });

  it('signin blocca account quando lockout e attivo', async () => {
    const now = new Date();
    prismaMock.$queryRaw.mockResolvedValue([
      { createdAt: now },
      { createdAt: now },
      { createdAt: now },
      { createdAt: now },
      { createdAt: now },
    ]);

    await expect(
      service.signin({
        email: 'user@example.com',
        password: 'Wrong$Pass1',
        userAgent: 'jest-agent',
      })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
