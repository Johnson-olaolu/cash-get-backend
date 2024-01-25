import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  // Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  otherNames?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  // @Matches('(^+)(234){1}[0-9]{10}')
  phoneNo: string;

  @IsEmail()
  email: string;

  @IsOptional()
  profilePicture?: Express.Multer.File;
}
