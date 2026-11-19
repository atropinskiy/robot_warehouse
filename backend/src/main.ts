import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Robots house')
    .setDescription('The Robots API description')
    .setVersion('1.0')
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI — http://localhost:4000/swagger (direct) or http://localhost/api/swagger (via nginx)
  SwaggerModule.setup('swagger', app, () => document, {
    jsonDocumentUrl: 'swagger/json',
  });

  // Scalar — http://localhost:4000/scalar (direct) or http://localhost/api/scalar (via nginx)
  app.use(
    '/scalar',
    apiReference({
      baseServerURL: process.env.SCALAR_BASE_URL ?? '/api',
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
