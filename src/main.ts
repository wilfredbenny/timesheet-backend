import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import {
  SwaggerModule,
  DocumentBuilder
} from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {

  (BigInt.prototype as any).toJSON =
  function () {
    return this.toString();
  };

  const app = await NestFactory.create(AppModule);
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });

  const config =
    new DocumentBuilder()

      .setTitle(
        'Timesheet Management API'
      )

      .setDescription(
        'Enterprise Timesheet Backend APIs'
      )

      .setVersion('1.0')

      .addBearerAuth(

        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header'
        },

        'access-token'
      )

      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config
    );

  SwaggerModule.setup(
    'api-docs',
    app,
    document
  );

  app.useGlobalFilters(
    new HttpExceptionFilter()
  );


  //validation to remove unwanted field values
  app.useGlobalPipes(

  new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
