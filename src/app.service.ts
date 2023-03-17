import { HttpStatus, Injectable } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';
import { InitiateAuthResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { CreateRequestsDto } from '/opt/src/libs/interfaces/request/create-requests.dto';
import { LoginRequestsDto } from '/opt/src/libs/interfaces/request/login-requests.dto';
import { TestRequestsDto } from '/opt/src/libs/interfaces/request/test-requests.dto';
import { UpdatePasswordRequestsDto } from '/opt/src/libs/interfaces/request/update-password-requests.dto';
import { CreateResponseDto } from '/opt/src/libs/interfaces/response/create-response.dto';
import { TestResponseDto } from '/opt/src/libs/interfaces/response/test-response.dto';
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
      await this._cognitoService.create(email, password, group);
      return formatResponse<CreateResponseDto>(
        {
          email,
        },
        SERVICE_NAME,
      );
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }

  async updatePassword(
    { password }: UpdatePasswordRequestsDto,
    email: string,
  ): Promise<APIGatewayProxyResult> {
    try {
      const response: boolean = await this._cognitoService.updatePassword(
        email,
        password,
      );
      return formatResponse<boolean>(response, SERVICE_NAME);
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }

  async login({
    email,
    password,
  }: LoginRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const response: InitiateAuthResponse = await this._cognitoService.login(
        email,
        password,
      );
      return formatResponse<InitiateAuthResponse>(response, SERVICE_NAME);
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
