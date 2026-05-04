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
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    passwordResetToken: {
      count: jest.fn(),
      create: jest.fn(),
    },
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
  };

  const jwtMock = {
    signAsync: jest.fn(),
  };

  const configMock = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
    get: jest.fn(),
  };

  const mailerMock = {
    sendPhishingAlert: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
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
      isEmployee: false,
    });
    jwtMock.signAsync.mockResolvedValue('jwt-token');
    prismaMock.refreshToken.create.mockResolvedValue(undefined);

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

  it('refreshTokens ruota il token valido e genera una nuova coppia', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue({
      id: 'rt-1',
      family: 'fam-1',
      isRevoked: false,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'u1',
        email: 'user@example.com',
        preferredLocale: 'it',
        isAdmin: false,
        isEmployee: false,
      },
    });
    prismaMock.refreshToken.update.mockResolvedValue(undefined);
    prismaMock.refreshToken.create.mockResolvedValue(undefined);
    jwtMock.signAsync.mockResolvedValue('new-access-token');

    const result = await service.refreshTokens('raw-refresh-token');

    expect(result.access_token).toBe('new-access-token');
    expect(result.refresh_token).toBeTruthy();
    expect(prismaMock.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'rt-1' },
      data: { usedAt: expect.any(Date) },
    });
    expect(prismaMock.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'u1',
          family: 'fam-1',
          expiresAt: expect.any(Date),
        }),
      })
    );
  });

  it('refreshTokens rifiuta token revocati, scaduti e riutilizzati fuori grace period', async () => {
    prismaMock.refreshToken.findUnique
      .mockResolvedValueOnce({
        id: 'revoked',
        family: 'fam-r',
        isRevoked: true,
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user: { id: 'u1', email: 'user@example.com', preferredLocale: 'it', isAdmin: false, isEmployee: false },
      })
      .mockResolvedValueOnce({
        id: 'expired',
        family: 'fam-e',
        isRevoked: false,
        usedAt: null,
        expiresAt: new Date(Date.now() - 60_000),
        user: { id: 'u1', email: 'user@example.com', preferredLocale: 'it', isAdmin: false, isEmployee: false },
      })
      .mockResolvedValueOnce({
        id: 'reused',
        family: 'fam-u',
        isRevoked: false,
        usedAt: new Date(Date.now() - 60_000),
        expiresAt: new Date(Date.now() + 60_000),
        user: { id: 'u1', email: 'user@example.com', preferredLocale: 'it', isAdmin: false, isEmployee: false },
      });
    prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 2 });

    await expect(service.refreshTokens('revoked-token')).rejects.toBeInstanceOf(Error);
    await expect(service.refreshTokens('expired-token')).rejects.toBeInstanceOf(Error);
    await expect(service.refreshTokens('reused-token')).rejects.toBeInstanceOf(Error);
    expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { family: 'fam-u' },
      data: { isRevoked: true },
    });
  });

  it('forgotPassword crea un reset token e invoca il mailer per utenti standard', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u-reset',
      isAdmin: false,
      preferredLocale: 'it',
    });
    prismaMock.passwordResetToken.count.mockResolvedValue(0);
    prismaMock.passwordResetToken.create.mockResolvedValue(undefined);
    configMock.getOrThrow.mockReturnValue('test-secret');
    configMock.get = jest.fn((key: string) =>
      key === 'FRONTEND_URL' ? 'http://frontend.test' : undefined
    );
    mailerMock.sendPasswordResetEmail.mockResolvedValue(undefined);

    await service.forgotPassword('reset@example.com');

    expect(prismaMock.passwordResetToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'u-reset',
          tokenHash: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      })
    );
    expect(mailerMock.sendPasswordResetEmail).toHaveBeenCalledWith(
      'reset@example.com',
      expect.stringContaining('http://frontend.test/reset-password?token='),
      'it'
    );
  });

  it('forgotPassword non invia mail a utenti admin o oltre rate limit', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'admin', isAdmin: true, preferredLocale: 'it' })
      .mockResolvedValueOnce({ id: 'user', isAdmin: false, preferredLocale: 'it' });
    prismaMock.passwordResetToken.count.mockResolvedValue(3);

    await service.forgotPassword('admin@example.com');
    await service.forgotPassword('limited@example.com');

    expect(prismaMock.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mailerMock.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
