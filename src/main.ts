import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dataSource from './database/data-source';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await dataSource.initialize();
  const configService = app.get(ConfigService);
  const port = +configService.get<number>('PORT');
  // const bodyJsonLimit = configService.get<number>('BODY_JSON_LIMIT_IN_MB');
  // app.useBodyParser('json', { limit: `${bodyJsonLimit}mb` });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );
  await app.listen(port);
}
bootstrap();
