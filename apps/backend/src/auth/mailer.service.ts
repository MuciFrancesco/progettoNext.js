import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resendApiUrl = 'https://api.resend.com/emails';

  constructor(private readonly config: ConfigService) {}

  async sendPhishingAlert(email: string, ipOrUserAgent?: string): Promise<void> {
    const nodeEnv = this.config.get<string>('NODE_ENV') ?? 'development';
    const environmentLabel = nodeEnv === 'production' ? '[PROD]' : '[DEV]';

    try {
      const subject = this.getPhishingSubject(localeFromNodeEnv(nodeEnv));
      const body = this.getPhishingBody(ipOrUserAgent);

      if (!this.isProviderConfigured()) {
        const warningMessage = [
          `${environmentLabel} Phishing alert would be sent to: ${email}`,
          `Subject: ${subject}`,
          `Device Info: ${ipOrUserAgent || 'N/A'}`,
          'Note: Configure RESEND_API_KEY and MAIL_FROM to enable real emails',
        ].join('\n');

        this.logger.warn(warningMessage);
        return;
      }

      await this.sendUsingProvider(email, environmentLabel, 'PHISHING_ALERT', subject, body);
    } catch (error) {
      this.logger.error(`${environmentLabel} Failed to send phishing alert to ${email}:`, error);
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string, locale: string): Promise<void> {
    const nodeEnv = this.config.get<string>('NODE_ENV') ?? 'development';
    const environmentLabel = nodeEnv === 'production' ? '[PROD]' : '[DEV]';

    const subject = this.getResetSubject(locale);
    const body = this.getResetBody(locale, resetLink);

    try {
      if (!this.isProviderConfigured()) {
        this.logger.log(
          `${environmentLabel} Password reset email to: ${email}\n` +
            `Subject: ${subject}\n` +
            `Reset link: ${resetLink}\n` +
            'Note: Configure RESEND_API_KEY and MAIL_FROM to enable real emails'
        );
        return;
      }

      await this.sendUsingProvider(email, environmentLabel, 'PASSWORD_RESET', subject, body);
    } catch (error) {
      this.logger.error(
        `${environmentLabel} Failed to send password reset email to ${email}:`,
        error
      );
    }
  }

  private getResetSubject(locale: string): string {
    const subjects: Record<string, string> = {
      it: 'Reimposta la tua password',
      en: 'Reset your password',
      fr: 'Réinitialiser votre mot de passe',
      es: 'Restablecer contraseña',
      de: 'Passwort zurücksetzen',
    };
    return subjects[locale] ?? subjects['it'];
  }

  private getResetBody(locale: string, resetLink: string): string {
    const bodies: Record<string, string> = {
      it: `Clicca sul link per reimpostare la password (valido 24 ore):\n${resetLink}\n\nSe non hai richiesto il reset, ignora questa email.`,
      en: `Click the link to reset your password (valid 24 hours):\n${resetLink}\n\nIf you didn't request this, please ignore this email.`,
      fr: `Cliquez sur le lien pour réinitialiser votre mot de passe (valable 24 heures):\n${resetLink}\n\nSi vous n'avez pas demandé cela, ignorez cet e-mail.`,
      es: `Haz clic en el enlace para restablecer tu contraseña (válido 24 horas):\n${resetLink}\n\nSi no solicitaste esto, ignora este correo.`,
      de: `Klicke auf den Link zum Zurücksetzen deines Passworts (gültig 24 Stunden):\n${resetLink}\n\nFalls du dies nicht angefordert hast, ignoriere diese E-Mail.`,
    };
    return bodies[locale] ?? bodies['it'];
  }

  private getPhishingSubject(locale: string): string {
    const subjects: Record<string, string> = {
      it: 'Avviso di sicurezza per il tuo account',
      en: 'Security alert for your account',
      fr: 'Alerte de securite pour votre compte',
      es: 'Alerta de seguridad para tu cuenta',
      de: 'Sicherheitswarnung fuer dein Konto',
    };
    return subjects[locale] ?? subjects['it'];
  }

  private getPhishingBody(ipOrUserAgent?: string): string {
    return [
      'Abbiamo rilevato tentativi sospetti di accesso al tuo account.',
      `Dettagli dispositivo: ${ipOrUserAgent || 'N/A'}`,
      'Se non sei stato tu, cambia immediatamente la password e contatta il supporto.',
    ].join('\n');
  }

  private isProviderConfigured(): boolean {
    return Boolean(
      this.config.get<string>('RESEND_API_KEY') && this.config.get<string>('MAIL_FROM')
    );
  }

  private sendUsingProvider(
    email: string,
    _environmentLabel: string,
    type: string,
    subject = 'Notification',
    body = ''
  ): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('MAIL_FROM');

    if (!apiKey || !from) {
      throw new Error(`[${type}] Email provider not configured.`);
    }

    return fetch(this.resendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        text: body,
      }),
    }).then(async (response) => {
      if (!response.ok) {
        const payload = await response.text().catch(() => '');
        throw new Error(`[${type}] Provider error ${response.status}: ${payload}`);
      }
    });
  }
}

function localeFromNodeEnv(_nodeEnv: string): string {
  return 'it';
}
