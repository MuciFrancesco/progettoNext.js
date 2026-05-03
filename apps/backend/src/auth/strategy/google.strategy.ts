import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import type { OAuthUser } from '../types/oauth-user.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID') || 'GOOGLE_CLIENT_ID_NOT_SET';
    const clientSecret =
      config.get<string>('GOOGLE_CLIENT_SECRET') || 'GOOGLE_CLIENT_SECRET_NOT_SET';
    const callbackURL =
      config.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3333/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): OAuthUser {
    const email = profile.emails?.[0]?.value?.toLowerCase().trim();
    if (!email) {
      throw new UnauthorizedException('Google non ha restituito una email valida');
    }

    return {
      email,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      provider: 'google',
      providerId: profile.id,
    };
  }
}
