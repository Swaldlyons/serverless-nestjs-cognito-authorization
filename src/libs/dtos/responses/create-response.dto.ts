import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResponseDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
