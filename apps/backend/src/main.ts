import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3333);
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:3000');

  if (config.get<string>('TRUST_PROXY') === 'true') {
    const httpAdapter = app.getHttpAdapter().getInstance();
    httpAdapter.set('trust proxy', 1);
  }

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
