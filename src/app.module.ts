import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AppService } from '/opt/src/app.service';
import config from '/opt/src/config';
import { CognitoService } from '/opt/src/libs/services/cognito.service';
import { COGNITO_IDENTITY } from '/opt/src/libs/shared/injectables';

const apiVersion = 'latest';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    CognitoService,
    {
      provide: COGNITO_IDENTITY,
      inject: [config.KEY],
      useFactory: ({ region }: ConfigType<typeof config>) =>
        new CognitoIdentityServiceProvider({
          apiVersion,
          region,
        }),
    },
  ],
})
export class AppModule {}
