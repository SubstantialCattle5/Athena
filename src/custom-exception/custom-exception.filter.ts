import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: HttpStatus;
    let message: string;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = `Database request failed: ${(exception as Prisma.PrismaClientKnownRequestError).message}`;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Validation failed: ${(exception as Prisma.PrismaClientValidationError).message}`;
    } else if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
      message = (exception as HttpException).getResponse() as string;
    } else if (exception instanceof Error) {
      // Handle generic Error instances
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'An unexpected error occurred';
    } else {
      // Fallback for non-Error exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
    }

    this.logger.error(message);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
