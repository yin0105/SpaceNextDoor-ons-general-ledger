import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  host: process.env.HOST || 'localhost',
  apiVersion: process.env.API_VERSION || 'v1',
  db: {
    uri: process.env.DB_URI,
  },
}));
