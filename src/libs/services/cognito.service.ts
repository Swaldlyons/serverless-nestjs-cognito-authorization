import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  AdminCreateUserResponse,
  InitiateAuthResponse,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { CognitoGroupsEnum } from '/opt/src/libs/shared/cognito-groups-enum';
import { ENV_VARS } from '/opt/src/libs/shared/enviroments';

const SERVICE_NAME = 'CognitoService';
const { region, userPoolId, clientId } = ENV_VARS;
const cognito = new CognitoIdentityServiceProvider({
  region,
  apiVersion: 'latest',
});

@Injectable()
export class CognitoService {
  async create(
    email: string,
    password: string,
    group: CognitoGroupsEnum,
  ): Promise<void> {
    console.log({
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
    const response: AdminCreateUserResponse = await cognito
      .adminCreateUser({
        UserPoolId: userPoolId,
        Username: email,
        TemporaryPassword: temporaryPassword,
        MessageAction: 'SUPPRESS',
      })
      .promise();
    await cognito
      .adminAddUserToGroup({
        GroupName: group,
        UserPoolId: userPoolId,
        Username: email,
      })
      .promise();
    await cognito
      .adminSetUserPassword({
        Password: password,
        Permanent: true,
        UserPoolId: userPoolId,
        Username: email,
      })
      .promise();
    console.log({ SERVICE_NAME, response });
  }

  async updatePassword(email: string, password: string): Promise<boolean> {
    console.log({
      SERVICE_NAME,
      params: {
        email,
        password,
      },
    });
    await cognito
      .adminSetUserPassword({
        Password: password,
        Permanent: true,
        UserPoolId: userPoolId,
        Username: email,
      })
      .promise();
    return true;
  }

  async login(email: string, password: string): Promise<InitiateAuthResponse> {
    console.log({
      SERVICE_NAME,
      params: {
        email,
        password,
      },
    });
    const response: InitiateAuthResponse = await cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
      .promise();
    console.log({ SERVICE_NAME, response });
    return response;
  }
}
