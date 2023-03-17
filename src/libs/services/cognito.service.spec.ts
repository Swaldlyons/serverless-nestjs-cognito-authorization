import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';

import { CognitoService } from '/opt/src/libs/services/cognito.service';
import { CognitoGroupsEnum } from '/opt/src/libs/shared/cognito-groups-enum';

describe('CognitoService', () => {
  let service: CognitoService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [CognitoService],
    }).compile();
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    service = MODULE.get<CognitoService>(CognitoService);
  });

  it('should return create user', async () => {
    const cognito = Object.getPrototypeOf(
      new AWS.CognitoIdentityServiceProvider(),
    );
    jest.spyOn(cognito, 'adminCreateUser').mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    jest.spyOn(cognito, 'adminAddUserToGroup').mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    jest.spyOn(cognito, 'adminSetUserPassword').mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    expect(
      await service.create('email@mail.com', 'test', CognitoGroupsEnum.GROUP_A),
    ).toBeUndefined();
  });

  it('should return update password', async () => {
    const cognito = Object.getPrototypeOf(
      new AWS.CognitoIdentityServiceProvider(),
    );
    jest.spyOn(cognito, 'adminSetUserPassword').mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    expect(await service.updatePassword('email@mail.com', 'test')).toEqual(
      true,
    );
  });

  it('should return login', async () => {
    const cognito = Object.getPrototypeOf(
      new AWS.CognitoIdentityServiceProvider(),
    );
    jest.spyOn(cognito, 'initiateAuth').mockReturnValue({
      promise: () => Promise.resolve({}),
    });
    expect(await service.login('email@mail.com', 'test')).toEqual({});
  });
});
