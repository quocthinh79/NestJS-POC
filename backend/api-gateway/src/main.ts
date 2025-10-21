import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionsFilter } from './common/filters/http-exception.filter';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties not in DTO
      forbidNonWhitelisted: true, // throw error if extra props exist
      transform: true, // transform plain JSON to class instance
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'], // your Swagger UI or frontend origin
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API Gateway for authentication and user management')
    .setVersion('1.0')
    .addBearerAuth() // enable JWT authentication scheme
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ✅ Logs all requests/responses for visibility
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  // ✅ Global error formatting
  app.useGlobalFilters(new HttpExceptionsFilter(), new RpcExceptionFilter());

  await app.listen(port);

  console.log(`🚀 API Gateway is running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
