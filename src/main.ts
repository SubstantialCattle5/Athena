import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors
      : true
  });
  app.use(cookieParser());

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('GooglexYug')
    .setDescription('The googlexyug API description')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap();

/** TODO
 * 1. finish up auth 
 * 2. fix survey 
 * 3. fix quiz
 * 
  */