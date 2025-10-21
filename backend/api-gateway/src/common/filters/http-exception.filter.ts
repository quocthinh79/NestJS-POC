import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ThrottlerException) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      typeof exception.getStatus() === 'number'
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as {
      status: number;
      errorMessage: string;
      errorCode: string;
    };

    const errorMessage = exceptionResponse?.errorMessage || 'Internal server error';
    const errorMessageCode = exceptionResponse?.errorCode || 'INTERNAL_SERVER_ERROR';

    return response
      .status(status)
      .json({ success: false, errorMessage, errorMessageCode, data: null });
  }
}
