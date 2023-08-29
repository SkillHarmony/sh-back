import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './setup-swagger';

// #TODO: add env variables
// #TODO: add swagger
// #TODO: add sequilize
// #TODO: create user resourceLimits
// #TODO: implement auth with jwt

const DEFAULT_PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(+config.get('PORT') || DEFAULT_PORT).then(() => {
    logger.log('Server started on: ', {
      port: +config.get('PORT') || DEFAULT_PORT,
    });
  });
}
bootstrap();
