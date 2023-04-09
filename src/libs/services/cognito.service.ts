import {
  AdminCreateUserCommandOutput,
  AdminSetUserPasswordCommandOutput,
  CognitoIdentityProvider,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CognitoGroupsEnum } from '/opt/src/libs/enums/cognito-groups-enum';
import { EnvironmentInterface } from '/opt/src/libs/interfaces/environment.interface';
import { COGNITO_IDENTITY } from '/opt/src/libs/shared/injectables';
import { log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'CognitoService';

@Injectable()
export class CognitoService {
  private readonly _clientId: string;
  private readonly _userPoolId: string;

  constructor(
    @Inject(COGNITO_IDENTITY)
    private readonly _cognito: CognitoIdentityProvider,
    private readonly _configService: ConfigService,
  ) {
    const { clientId, userPoolId }: EnvironmentInterface =
      this._configService.get<EnvironmentInterface>('config');

    this._clientId = clientId;
    this._userPoolId = userPoolId;
  }

  async create(
    email: string,
    password: string,
    group: CognitoGroupsEnum,
  ): Promise<AdminCreateUserCommandOutput> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        email,
        group,
      },
    });
    const random: string = Math.random().toString(36);
    const temporaryPassword = `${random.substring(2, 10).toUpperCase()}${random
      .substring(11, 36)
      .toLowerCase()}@`;
    const response: AdminCreateUserCommandOutput =
      await this._cognito.adminCreateUser({
        UserPoolId: this._userPoolId,
        Username: email,
        TemporaryPassword: temporaryPassword,
        MessageAction: 'SUPPRESS',
      });

    await this._cognito.adminAddUserToGroup({
      GroupName: group,
      UserPoolId: this._userPoolId,
      Username: email,
    });
    await this._cognito.adminSetUserPassword({
      Password: password,
      Permanent: true,
      UserPoolId: this._userPoolId,
      Username: email,
    });

    return response;
  }

  async updatePassword(
    email: string,
    password: string,
  ): Promise<AdminSetUserPasswordCommandOutput> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        email,
        password,
      },
    });

    return await this._cognito.adminSetUserPassword({
      Password: password,
      Permanent: true,
      UserPoolId: this._userPoolId,
      Username: email,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<InitiateAuthCommandOutput> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        email,
        password,
      },
    });

    return await this._cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this._clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });
  }
}
