import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { connect } from 'mongoose';

import { AppModule } from './app.module';
import appConfig from './config/app.config';
dotenv.config();

const logger = new Logger('MainApp', true);

async function bootstrap(): Promise<void> {
  const configService = new ConfigService({ app: appConfig() });
  const port = configService.get<number>('app.port');
  const host = configService.get<string>('app.host');
  const apiVersion = configService.get<string>('app.apiVersion');
  const dbUri = configService.get<string>('app.db.uri');
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  try {
    await connect(dbUri, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Connected to mongo db...');
  } catch (e) {
    console.log('Something went wrong while connecting to mongodb..', e);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(apiVersion);
  app.useLogger(logger);
  await app.listen(port, host);
}
/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap();
