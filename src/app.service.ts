import {
  AdminCreateUserCommandOutput,
  AdminSetUserPasswordCommandOutput,
  AttributeType,
  AuthenticationResultType,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { HttpStatus, Injectable } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';

import { CreateRequestsDto } from '/opt/src/libs/dtos/requests/create-requests.dto';
import { LoginRequestsDto } from '/opt/src/libs/dtos/requests/login-requests.dto';
import { TestRequestsDto } from '/opt/src/libs/dtos/requests/test-requests.dto';
import { UpdatePasswordRequestsDto } from '/opt/src/libs/dtos/requests/update-password-requests.dto';
import { TestResponseDto } from '/opt/src/libs/dtos/responses/test-response.dto';
import { CognitoService } from '/opt/src/libs/services/cognito.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

@Injectable()
export class AppService {
  constructor(private readonly _cognitoService: CognitoService) {}
  async create({
    email,
    password,
    group,
  }: CreateRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const {
        User: { Attributes },
      }: AdminCreateUserCommandOutput = await this._cognitoService.create(
        email,
        password,
        group,
      );

      return formatResponse<AttributeType[]>(Attributes, SERVICE_NAME);
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }

  async updatePassword(
    { password }: UpdatePasswordRequestsDto,
    email: string,
  ): Promise<APIGatewayProxyResult> {
    try {
      const {
        $metadata: { httpStatusCode },
      }: AdminSetUserPasswordCommandOutput =
        await this._cognitoService.updatePassword(email, password);

      return formatResponse<boolean>(httpStatusCode === 200, SERVICE_NAME);
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }

  async login({
    email,
    password,
  }: LoginRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const { AuthenticationResult }: InitiateAuthCommandOutput =
        await this._cognitoService.login(email, password);

      return formatResponse<AuthenticationResultType>(
        AuthenticationResult,
        SERVICE_NAME,
      );
    } catch (e) {
      return errorResponse(e, SERVICE_NAME, HttpStatus.UNAUTHORIZED);
    }
  }

  async test(request: TestRequestsDto): Promise<APIGatewayProxyResult> {
    return formatResponse<TestResponseDto>(
      { email: `${request.email}` },
      SERVICE_NAME,
    );
  }
}
