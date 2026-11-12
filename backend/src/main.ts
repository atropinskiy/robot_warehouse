import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DbService } from './db/db.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const prisma = app.get(DbService);
  const config = app.get(ConfigService);
  // const cookieParser = require('cookie-parser');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') || 'http://localhost:5173',
    credentials: true,
  });
  // app.use(cookieParser());
  app.enableShutdownHooks();
  await prisma.enableShutdownHooks(app);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error', err);
  process.exit(1);
});
