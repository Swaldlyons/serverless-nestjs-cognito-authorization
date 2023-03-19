import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestsDto {
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly password: string;
}
