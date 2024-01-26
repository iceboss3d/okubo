import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MinLength(11)
  phone_number: string;
}
