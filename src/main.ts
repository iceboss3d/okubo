import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      allowedHeaders: [
        'Origin',
        'Content-Type',
        'Accept',
        'x-subject-type',
        'X-Requested-With',
        'Authorization',
      ],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: ['http://localhost:3000'],
      preflightContinue: false,
    },
  });
  app.setGlobalPrefix('api');

  app.useGlobalGuards();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, stopAtFirstError: true }),
  );
  await app.listen(process.env.PORT || 8000);
}
bootstrap()
  .then(() => {
    Logger.log(
      `Server running on port ${process.env.PORT || 8000}`,
      'Bootstrap',
    );
  })
  .catch((error) => {
    Logger.log('Offline');
    Logger.log(error);
    process.exit(1);
  });
