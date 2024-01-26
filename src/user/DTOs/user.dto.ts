import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserIdDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class UserEmailDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
