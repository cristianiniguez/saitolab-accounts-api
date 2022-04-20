import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  env: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
}));
