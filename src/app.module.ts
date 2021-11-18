import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

import appConfig from './config/app.config';
import { LedgerModule } from './ledger/ledger.module';
import { TerminusOptionsService } from './shared/health-check/terminus-options.service';
import { TimeoutInterceptor } from './shared/interceptor/timeout.interceptor';
import { formatError } from './utils/formatError';

@Module({
  imports: [
    LedgerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        include: [],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        installSubscriptionHandlers: true,
        context: ({ request }) => ({ req: request }),
        introspection: true,
        tracing: true,
        playground: true,
        debug: configService.get<string>('app.nodeEnv') === 'development',
        resolverValidationOptions: {
          requireResolversForResolveType: 'error',
        },
        formatError,
        formatResponse: (response) => response,
      }),
      inject: [ConfigService],
    }),
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
