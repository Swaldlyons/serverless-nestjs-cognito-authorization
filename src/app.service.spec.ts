import {
  CognitoIdentityProvider,
  InitiateAuthResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '/opt/src/app.service';
import { CognitoGroupsEnum } from '/opt/src/libs/enums/cognito-groups-enum';
import { CognitoService } from '/opt/src/libs/services/cognito.service';
import { COGNITO_IDENTITY } from '/opt/src/libs/shared/injectables';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

describe('AppService', () => {
  let service: AppService;
  let cognitoService: CognitoService;

  beforeEach(async () => {
    global.console = require('console');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        CognitoService,
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
          useValue: CognitoIdentityProvider,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    cognitoService = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should return create user', async () => {
    jest
      .spyOn(cognitoService, 'create')
      .mockImplementation(async (): Promise<void> => Promise.resolve(null));
    expect(
      await service.create({
        email: 'email@mail.com',
        password: 'test',
        group: CognitoGroupsEnum.GROUP_A,
      }),
    ).toEqual(
      formatResponse(
        {
          email: 'email@mail.com',
        },
        SERVICE_NAME,
      ),
    );
  });

  it('should return create error', async () => {
    jest
      .spyOn(cognitoService, 'create')
      .mockRejectedValue(new Error('Test Error'));
    expect(
      await service.create({
        email: 'email@mail.com',
        password: 'test',
        group: CognitoGroupsEnum.GROUP_A,
      }),
    ).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
      ),
    );
  });

  it('should return auth', async () => {
    jest
      .spyOn(cognitoService, 'login')
      .mockImplementation(
        async (): Promise<InitiateAuthResponse> => Promise.resolve({}),
      );
    expect(
      await service.login({ email: 'email@mail.com', password: '123' }),
    ).toEqual(formatResponse({}, SERVICE_NAME));
  });

  it('should return auth error', async () => {
    jest
      .spyOn(cognitoService, 'login')
      .mockRejectedValue(new Error('Test Error'));

    expect(
      await service.login({ email: 'email@mail.com', password: '123' }),
    ).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
        HttpStatus.UNAUTHORIZED,
      ),
    );
  });

  it('should return update password', async () => {
    jest
      .spyOn(cognitoService, 'updatePassword')
      .mockImplementation(async (): Promise<void> => Promise.resolve(null));
    expect(
      await service.updatePassword(
        {
          password: '123',
        },
        'email@mail.com',
      ),
    ).toEqual(formatResponse(true, SERVICE_NAME));
  });

  it('should return update password error', async () => {
    jest
      .spyOn(cognitoService, 'updatePassword')
      .mockRejectedValue(new Error('Test Error'));

    expect(
      await service.updatePassword(
        {
          password: '123',
        },
        'email@mail.com',
      ),
    ).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
      ),
    );
  });

  it('should return true', async () => {
    expect(await service.test({ email: 'email@mail.com' })).toEqual(
      formatResponse({ email: 'email@mail.com' }, SERVICE_NAME),
    );
  });
});
