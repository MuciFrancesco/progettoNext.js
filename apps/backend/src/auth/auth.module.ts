import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppleOAuthStrategy, FacebookStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { MailerService } from './mailer.service';
import { OAuthCodeService } from './oauth-code.service';

// FIX rispetto a StudioBE:
// - PrismaModule rimosso (è @Global(), non serve importarlo qui)
// - JwtModule.registerAsync() con ConfigService (non process.env diretto)
// - expiresIn coerente con signToken nel service
@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AppleOAuthStrategy,
    MailerService,
    OAuthCodeService,
  ],
})
export class AuthModule {}
