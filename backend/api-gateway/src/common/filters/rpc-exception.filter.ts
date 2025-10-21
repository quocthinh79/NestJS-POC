import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getError() as {
      status: number;
      errorMessage: string;
      errorCode: string;
    };

    const errorMessage = exceptionResponse?.errorMessage || 'Internal server error';
    const errorMessageCode = exceptionResponse?.errorCode || 'INTERNAL_SERVER_ERROR';

    return ctx
      .getContext()
      .reply({ success: false, errorMessage, errorMessageCode, data: null, status });
  }
}
