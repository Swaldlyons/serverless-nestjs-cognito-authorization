import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordRequestsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  @Expose()
  readonly password: string;
}
