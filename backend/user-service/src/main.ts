import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 4001;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST || '127.0.0.1',
      port: parseInt(process.env.USER_SERVICE_PORT || '4001', 10),
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties not in DTO
      forbidNonWhitelisted: true, // throw error if extra props exist
      transform: true, // transform plain JSON to class instance
    }),
  );

  await app.listen();
  console.log(`✅ Users microservice is running on port ${port}`);
}
bootstrap();
