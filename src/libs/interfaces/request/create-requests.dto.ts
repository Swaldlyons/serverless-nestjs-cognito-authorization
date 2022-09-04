import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { CognitoGroupsEnum } from '/opt/src/libs/shared/cognito-groups-enum';

export class CreateRequestsDto {
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly email: string;

  @IsEnum(CognitoGroupsEnum)
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly group: CognitoGroupsEnum;
}
