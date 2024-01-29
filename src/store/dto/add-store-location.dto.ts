import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class AddStoreLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  briefInfo?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsBoolean()
  isExternalCoordinator: boolean;

  @IsOptional()
  @ValidateNested()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => CreateUserDto)
  coordinatorDetails?: CreateUserDto;
}
