import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

import { CognitoGroupsEnum } from '/opt/src/libs/enums/cognito-groups-enum';

export class CreateRequestsDto {
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  @Expose()
  readonly password: string;

  @IsEnum(CognitoGroupsEnum)
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly group: CognitoGroupsEnum;
}
