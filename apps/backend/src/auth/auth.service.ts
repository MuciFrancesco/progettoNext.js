import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from './mailer.service';
import { SigninDto, SignupDto } from './dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import type { OAuthUser } from './types/oauth-user.type';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 15;
  private readonly WARNING_THRESHOLD = 3;

  // Refresh token config
  private readonly REFRESH_TOKEN_BYTES = 64; // â†’ 128-char hex
  private readonly REFRESH_TOKEN_TTL_DAYS = 7;
  private readonly REFRESH_GRACE_PERIOD_MS = 30_000; // 30 s

  // Password reset config
  private readonly RESET_TOKEN_BYTES = 64; // â†’ 128-char hex
  private readonly RESET_TOKEN_TTL_HOURS = 24;
  private readonly RESET_RATE_LIMIT = 3; // max req/hour
  private readonly RESET_RATE_WINDOW_MS = 3_600_000; // 1 h

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService
  ) {}

  private get db() {
    return this.prisma;
  }

  private readonly LOGIN_ATTEMPTS_WINDOW_MS = this.LOCKOUT_DURATION_MINUTES * 60 * 1000;

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  private generateRawToken(bytes: number): string {
    return randomBytes(bytes).toString('hex');
  }

  private async createAccessToken(
    userId: string,
    email: string,
    preferredLocale: string,
    isAdmin: boolean
  ): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, email, preferredLocale, isAdmin },
      { secret: this.config.getOrThrow<string>('JWT_SECRET'), expiresIn: '15m' }
    );
  }

  private async signTokens(
    userId: string,
    email: string,
    preferredLocale: string,
    isAdmin: boolean
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.createAccessToken(userId, email, preferredLocale, isAdmin);

    const raw = this.generateRawToken(this.REFRESH_TOKEN_BYTES);
    const tokenHash = this.sha256(raw);
    const family = randomUUID();
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.db.refreshToken.create({
      data: { tokenHash, userId, family, expiresAt },
    });

    return { access_token, refresh_token: raw };
  }

  // â”€â”€ Signup / Signin / OAuth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async signup(dto: SignupDto): Promise<{ access_token: string; refresh_token: string }> {
    const hash = await argon.hash(dto.password);

    try {
      const user = (await this.db.user.create({
        data: {
          email: dto.email,
          hash,
          firstname: dto.firstName,
          lastname: dto.lastName,
          isAdmin: false,
        },
        select: { id: true, email: true, preferredLocale: true, isAdmin: true },
      })) as { id: string; email: string; preferredLocale: string; isAdmin: boolean };

      return this.signTokens(user.id, user.email, user.preferredLocale, user.isAdmin);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email giÃ  in uso');
      }
      throw error;
    }
  }

  async signinWithOAuth(
    profile: OAuthUser
  ): Promise<{ access_token: string; refresh_token: string }> {
    const email = profile.email.toLowerCase().trim();

    let user: {
      id: string;
      email: string;
      preferredLocale: string;
      isAdmin: boolean;
      firstname: string | null;
      lastname: string | null;
    } | null = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        preferredLocale: true,
        isAdmin: true,
        firstname: true,
        lastname: true,
      },
    });

    if (user === null) {
      const generatedHash = await argon.hash(randomUUID());
      user = await this.db.user.create({
        data: {
          email,
          hash: generatedHash,
          firstname: profile.firstName,
          lastname: profile.lastName,
          isAdmin: false,
        },
        select: {
          id: true,
          email: true,
          preferredLocale: true,
          isAdmin: true,
          firstname: true,
          lastname: true,
        },
      });
    } else {
      const shouldUpdateFirstName = !user.firstname && !!profile.firstName;
      const shouldUpdateLastName = !user.lastname && !!profile.lastName;
      if (shouldUpdateFirstName || shouldUpdateLastName) {
        user = await this.db.user.update({
          where: { id: user.id },
          data: {
            firstname: shouldUpdateFirstName ? profile.firstName : user.firstname,
            lastname: shouldUpdateLastName ? profile.lastName : user.lastname,
          },
          select: {
            id: true,
            email: true,
            preferredLocale: true,
            isAdmin: true,
            firstname: true,
            lastname: true,
          },
        });
      }
    }

    if (user === null) throw new ForbiddenException('Impossibile autenticare utente OAuth');
    return this.signTokens(user.id, user.email, user.preferredLocale, user.isAdmin);
  }

  async signin(dto: SigninDto): Promise<SigninResponseDto> {
    const lockoutStatus = await this.checkLockout(dto.email);
    if (lockoutStatus.isLocked) {
      throw new ForbiddenException(
        `Account temporaneamente bloccato. Riprova tra ${lockoutStatus.minutesRemaining} minuti.`
      );
    }

    const user = (await this.db.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, hash: true, preferredLocale: true, isAdmin: true },
    })) as {
      id: string;
      email: string;
      hash: string;
      preferredLocale: string;
      isAdmin: boolean;
    } | null;

    if (!user) {
      const failedCount = await this.recordFailedAttempt(dto.email);
      const remainingAttempts = Math.max(this.MAX_FAILED_ATTEMPTS - failedCount, 0);
      if (failedCount >= this.WARNING_THRESHOLD) {
        return {
          access_token: '',
          remainingAttempts,
          isBlocked: failedCount >= this.MAX_FAILED_ATTEMPTS,
        };
      }
      throw new ForbiddenException('Credenziali non valide');
    }

    const passwordMatch = await argon.verify(user.hash, dto.password);
    if (!passwordMatch) {
      const failedCount = await this.recordFailedAttempt(dto.email);
      const remainingAttempts = Math.max(this.MAX_FAILED_ATTEMPTS - failedCount, 0);
      if (failedCount >= this.MAX_FAILED_ATTEMPTS) {
        await this.mailer.sendPhishingAlert(dto.email, dto.userAgent);
      }
      if (failedCount >= this.WARNING_THRESHOLD) {
        return {
          access_token: '',
          remainingAttempts,
          isBlocked: failedCount >= this.MAX_FAILED_ATTEMPTS,
        };
      }
      throw new ForbiddenException('Credenziali non valide');
    }

    await this.db.$executeRaw`DELETE FROM "login_attempts" WHERE email = ${dto.email}`;

    const tokens = await this.signTokens(user.id, user.email, user.preferredLocale, user.isAdmin);
    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
  }

  // â”€â”€ Refresh Token â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async refreshTokens(
    rawRefreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hash = this.sha256(rawRefreshToken);

    const stored = await this.db.refreshToken.findUnique({
      where: { tokenHash: hash },
      include: {
        user: { select: { id: true, email: true, preferredLocale: true, isAdmin: true } },
      },
    });

    if (!stored) throw new UnauthorizedException('Refresh token non valido');
    if (stored.isRevoked) throw new UnauthorizedException('Refresh token revocato');
    if (stored.expiresAt < new Date()) throw new UnauthorizedException('Refresh token scaduto');

    // â”€â”€ Reuse detection with grace period â”€â”€
    if (stored.usedAt !== null) {
      const timeSinceUse = Date.now() - stored.usedAt.getTime();

      if (timeSinceUse <= this.REFRESH_GRACE_PERIOD_MS) {
        // Inside grace period: network retry scenario â€” issue a new token in the same family
        // without revoking the replacement that was already issued.
        const raw = this.generateRawToken(this.REFRESH_TOKEN_BYTES);
        const tokenHash = this.sha256(raw);
        await this.db.refreshToken.create({
          data: {
            tokenHash,
            userId: stored.user.id,
            family: stored.family,
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
          },
        });
        const access_token = await this.createAccessToken(
          stored.user.id,
          stored.user.email,
          stored.user.preferredLocale,
          stored.user.isAdmin
        );
        return { access_token, refresh_token: raw };
      }

      // Outside grace period â€” TOKEN REUSE DETECTED â†’ revoke entire family
      await this.db.refreshToken.updateMany({
        where: { family: stored.family },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Sessione non valida. Effettua nuovamente il login.');
    }

    // â”€â”€ Normal rotation â”€â”€
    await this.db.refreshToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    const raw = this.generateRawToken(this.REFRESH_TOKEN_BYTES);
    const tokenHash = this.sha256(raw);
    await this.db.refreshToken.create({
      data: {
        tokenHash,
        userId: stored.user.id,
        family: stored.family,
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    const access_token = await this.createAccessToken(
      stored.user.id,
      stored.user.email,
      stored.user.preferredLocale,
      stored.user.isAdmin
    );
    return { access_token, refresh_token: raw };
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) return;
    const hash = this.sha256(rawRefreshToken);
    const stored = await this.db.refreshToken.findUnique({ where: { tokenHash: hash } });
    if (!stored) return;
    await this.db.refreshToken.updateMany({
      where: { family: stored.family },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  // â”€â”€ Password Reset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async forgotPassword(email: string): Promise<void> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: { id: true, isAdmin: true, preferredLocale: true },
    });

    // Never reveal whether the email exists or belongs to an admin
    if (!user || user.isAdmin) return;

    // Rate limit: max 3 requests per hour
    const windowStart = new Date(Date.now() - this.RESET_RATE_WINDOW_MS);
    const recentCount = await this.db.passwordResetToken.count({
      where: { userId: user.id, createdAt: { gt: windowStart } },
    });
    if (recentCount >= this.RESET_RATE_LIMIT) return;

    const raw = this.generateRawToken(this.RESET_TOKEN_BYTES);
    const tokenHash = this.sha256(raw);
    const expiresAt = new Date(Date.now() + this.RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await this.db.passwordResetToken.create({
      data: { tokenHash, userId: user.id, expiresAt },
    });

    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${raw}`;

    await this.mailer.sendPasswordResetEmail(email, resetLink, user.preferredLocale);
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = this.sha256(rawToken);

    const stored = await this.db.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!stored) throw new ForbiddenException('Token non valido o scaduto');
    if (stored.usedAt !== null) throw new ForbiddenException('Token giÃ  utilizzato');
    if (stored.expiresAt < new Date()) throw new ForbiddenException('Token scaduto');

    const newHash = await argon.hash(newPassword);

    await this.db.$transaction([
      this.db.user.update({ where: { id: stored.userId }, data: { hash: newHash } }),
      this.db.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await this.revokeAllUserRefreshTokens(stored.userId);
  }

  // â”€â”€ Private login helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private async recordFailedAttempt(email: string): Promise<number> {
    const cutoff = new Date(Date.now() - this.LOGIN_ATTEMPTS_WINDOW_MS);
    const attemptId = randomUUID();

    await this.db.$executeRaw`
      INSERT INTO "login_attempts" (id, email, success, "createdAt")
      VALUES (${attemptId}, ${email}, false, NOW())
    `;

    const result = await this.db.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS count
      FROM "login_attempts"
      WHERE email = ${email}
        AND success = false
        AND "createdAt" >= ${cutoff}
    `;

    return result[0]?.count ?? 0;
  }

  private async checkLockout(
    email: string
  ): Promise<{ isLocked: boolean; minutesRemaining?: number }> {
    const cutoff = new Date(Date.now() - this.LOGIN_ATTEMPTS_WINDOW_MS);
    const failedAttempts = await this.db.$queryRaw<Array<{ createdAt: Date }>>`
      SELECT "createdAt"
      FROM "login_attempts"
      WHERE email = ${email}
        AND success = false
        AND "createdAt" >= ${cutoff}
      ORDER BY "createdAt" DESC
      LIMIT ${this.MAX_FAILED_ATTEMPTS}
    `;

    if (failedAttempts.length < this.MAX_FAILED_ATTEMPTS) return { isLocked: false };

    const oldestAttempt = failedAttempts.at(-1);
    if (!oldestAttempt) return { isLocked: false };

    const lockoutEnd = new Date(
      oldestAttempt.createdAt.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000
    );
    const minutesRemaining = Math.ceil((lockoutEnd.getTime() - Date.now()) / (60 * 1000));
    return minutesRemaining > 0 ? { isLocked: true, minutesRemaining } : { isLocked: false };
  }
}
