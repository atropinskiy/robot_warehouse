import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Robots house')
    .setDescription('The Robots API description')
    .setVersion('1.0')
    .build()


  // первый вариант  традиционный swagger http://localhost:4000/swagger
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  // второй  вариант http://localhost:4000/scalar
  app.use(
    '/scalar',
    apiReference({
      baseServerURL: '/api',
      content: documentFactory(),
    }),
  )


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
