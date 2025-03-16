import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { patchNestjsSwagger } from '@anatine/zod-nestjs';

import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);
  const serverPort = envService.get('SERVER_PORT');

  patchNestjsSwagger();

  const TITLE = 'Nest Clean Architecture';
  const DESCRIPTION = 'The NestJS Clean Architecture Boilerplate';
  const API_VERSION = '1.0';

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: TITLE,
  });

  logger.log(`listening app at ${serverPort}`);

  await app.listen(serverPort);

  const url = await app.getUrl();
  logger.log(`listening app at ${url}`);
}
bootstrap();
