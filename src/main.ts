import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './custom-exception/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  app.use(cookieParser());

  // Swagger docs with authentication
  const config = new DocumentBuilder()
    .setTitle('GooglexYug')
    .setDescription('The googlexyug API description')
    .setVersion('1.0')
    .addTag('app')
    .addBearerAuth({ type: 'http', bearerFormat: "JWT", scheme: "bearer", in: "header" }, "access-token")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
