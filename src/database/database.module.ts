import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';

import config from 'src/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, dbName, host, password, user } =
          configService.mongo;
        return {
          dbName,
          pass: password,
          uri: `${connection}://${host}`,
          user,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
