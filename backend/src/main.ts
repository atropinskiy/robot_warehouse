import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { DbService } from './db/db.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const prisma = app.get(DbService);
  const config = app.get(ConfigService);
  const cookieParser = require('cookie-parser');

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') || 'http://localhost:5173',
    credentials: true,
  });
  app.use(cookieParser());
  app.enableShutdownHooks();
  await prisma.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- OpenAPI / Swagger ---
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Robot Warehouse API')
    .setDescription('API платформы управления роботами на симулируемом складе')
    .setVersion('0.1.0')
    .addTag('auth', 'Аутентификация и пользователи')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Swagger UI: /docs (через nginx: /api/docs)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Scalar API reference: /docs/scalar (через nginx: /api/docs/scalar)
  app.use('/docs/scalar', apiReference({ content: document }));

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error', err);
  process.exit(1);
});
