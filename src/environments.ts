import * as dotenv from 'dotenv';
import * as path from 'path';

export const environments = {
  dev: '.env',
  staging: '.env.staging',
  test: '.env.test',
  production: '.env.production',
};

export const getEnvFileName = (): string =>
  environments[process.env.NODE_ENV || 'dev'] || '.env';

// only used for typeorm migrations
export const loadEnvironment = () => {
  dotenv.config({
    path: path.resolve(process.cwd(), getEnvFileName()),
  });
};
