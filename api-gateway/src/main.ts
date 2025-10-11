import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(port);

  console.log(`🚀 API Gateway is running on port ${port}`);
}
bootstrap();
