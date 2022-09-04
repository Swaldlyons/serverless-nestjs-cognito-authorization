import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateResponseDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
