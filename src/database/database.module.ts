import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import config from 'src/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          autoLoadEntities: true,
          ssl:
            configService.env === 'production'
              ? { rejectUnauthorized: false }
              : false,
          synchronize: false,
          type: 'postgres',
          url: configService.databaseUrl,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
