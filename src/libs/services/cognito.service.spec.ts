import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { CognitoGroupsEnum } from '/opt/src/libs/enums/cognito-groups-enum';
import { CognitoService } from '/opt/src/libs/services/cognito.service';
import { COGNITO_IDENTITY } from '/opt/src/libs/shared/injectables';

describe('CognitoService', () => {
  let cognito: CognitoIdentityServiceProvider;
  let service: CognitoService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [
        CognitoService,
        CognitoIdentityServiceProvider,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({
              accountId: process.env.ACCOUNT_ID,
              stage: process.env.STAGE,
              region: process.env.REGION,
              userPoolId: process.env.USER_POOL_ID,
              clientId: process.env.CLIENT_ID,
            }),
          }),
        },
        {
          provide: COGNITO_IDENTITY,
          useValue: CognitoIdentityServiceProvider,
        },
      ],
    }).compile();

    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    service = MODULE.get<CognitoService>(CognitoService);
    cognito = MODULE.get<CognitoIdentityServiceProvider>(COGNITO_IDENTITY);
  });

  it('should return create user', async () => {
    cognito.adminCreateUser = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));
    cognito.adminAddUserToGroup = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));
    cognito.adminAddUserToGroup = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));
    cognito.adminSetUserPassword = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));

    expect(
      await service.create('email@mail.com', 'test', CognitoGroupsEnum.GROUP_A),
    ).toBeUndefined();
  });

  it('should return update password', async () => {
    cognito.adminSetUserPassword = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));
    expect(
      await service.updatePassword('email@mail.com', 'test'),
    ).toBeUndefined();
  });

  it('should return login', async () => {
    cognito.initiateAuth = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({}),
    }));
    expect(await service.login('email@mail.com', 'test')).toEqual({});
  });
});
