import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties not in DTO
      forbidNonWhitelisted: true, // throw error if extra props exist
      transform: true, // transform plain JSON to class instance
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API Gateway for authentication and user management')
    .setVersion('1.0')
    .addBearerAuth() // enable JWT authentication scheme
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`🚀 API Gateway is running on port ${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
