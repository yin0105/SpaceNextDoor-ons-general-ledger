import { HealthCheckError } from '@godaddy/terminus';
import { Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicatorResult,
  TerminusEndpoint,
  TerminusModuleOptions,
  TerminusOptionsFactory,
} from '@nestjs/terminus';
import mongoose from 'mongoose';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health',
      healthIndicators: [
        async () => {
          const result: HealthIndicatorResult = {
            'Database service': {
              status: 'up',
            },
          };
          if (mongoose.connection.readyState === 1) {
            Logger.log('Database is up');
            return result;
          }
          throw new HealthCheckError('Database is down', '');
        },
      ],
    };
    return {
      endpoints: [healthEndpoint],
    };
  }
}
