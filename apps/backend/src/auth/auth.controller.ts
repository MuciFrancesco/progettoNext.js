import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { OAuthCodeService } from './oauth-code.service';
import {
  ForgotPasswordDto,
  OAuthExchangeDto,
  RefreshDto,
  ResetPasswordDto,
  SigninDto,
  SigninResponseDto,
  SignupDto,
} from './dto';
import type { OAuthUser } from './types/oauth-user.type';

type OAuthRequest = Request & { user: OAuthUser };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthCodeService: OAuthCodeService,
    private readonly config: ConfigService
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SigninDto,
    @Headers('user-agent') userAgent?: string
  ): Promise<SigninResponseDto> {
    dto.userAgent = userAgent;
    return this.authService.signin(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: { refresh_token?: string }) {
    await this.authService.logout(body.refresh_token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: "Se l'email è registrata, riceverai un link di reset." };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Password aggiornata con successo.' };
  }

  @Post('oauth/exchange')
  @HttpCode(HttpStatus.OK)
  oauthExchange(@Body() dto: OAuthExchangeDto) {
    const tokens = this.oauthCodeService.exchange(dto.code);
    if (!tokens) throw new UnauthorizedException('OAuth code non valido o scaduto');
    return tokens;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('/', 302)
  async googleCallback(@Req() req: OAuthRequest) {
    const tokens = await this.authService.signinWithOAuth(req.user);
    const code = this.oauthCodeService.store(tokens);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return { url: `${frontendUrl}/auth/oauth/callback?code=${code}` };
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth(): void {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @Redirect('/', 302)
  async facebookCallback(@Req() req: OAuthRequest) {
    const tokens = await this.authService.signinWithOAuth(req.user);
    const code = this.oauthCodeService.store(tokens);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return { url: `${frontendUrl}/auth/oauth/callback?code=${code}` };
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  appleAuth(): void {
    return;
  }

  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  @Redirect('/', 302)
  async appleCallback(@Req() req: OAuthRequest) {
    const tokens = await this.authService.signinWithOAuth(req.user);
    const code = this.oauthCodeService.store(tokens);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return { url: `${frontendUrl}/auth/oauth/callback?code=${code}` };
  }
}
