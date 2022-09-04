import { Module } from '@nestjs/common';

import { AppService } from '/opt/src/app.service';
import { CognitoService } from '/opt/src/libs/services/cognito.service';

@Module({
  providers: [AppService, CognitoService],
})
export class AppModule {}
