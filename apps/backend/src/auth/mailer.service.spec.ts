import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
  const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

  function createConfig(values: Record<string, string | undefined>) {
    return {
      get: jest.fn((key: string) => values[key]),
    } as unknown as ConfigService;
  }

  beforeEach(() => {
    warnSpy.mockClear();
    logSpy.mockClear();
    errorSpy.mockClear();
    global.fetch = jest.fn();
  });

  it('logs and skips provider calls when password reset provider is not configured', async () => {
    const service = new MailerService(
      createConfig({
        NODE_ENV: 'development',
        RESEND_API_KEY: undefined,
        MAIL_FROM: undefined,
      })
    );

    await service.sendPasswordResetEmail('user@example.com', 'http://reset.test', 'it');

    expect(logSpy).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends password reset email through the provider when configured', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });
    const service = new MailerService(
      createConfig({
        NODE_ENV: 'production',
        RESEND_API_KEY: 'resend-key',
        MAIL_FROM: 'noreply@example.com',
      })
    );

    await service.sendPasswordResetEmail('user@example.com', 'http://reset.test', 'en');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer resend-key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('logs phishing alerts locally when provider is not configured', async () => {
    const service = new MailerService(
      createConfig({
        NODE_ENV: 'development',
        RESEND_API_KEY: undefined,
        MAIL_FROM: undefined,
      })
    );

    await service.sendPhishingAlert('user@example.com', 'jest-agent');

    expect(warnSpy).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
