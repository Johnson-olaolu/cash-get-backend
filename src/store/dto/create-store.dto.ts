import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { StoreTypeEnum } from 'src/utils/constants';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  logo?: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  briefInfo?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  website?: string;

  @IsEnum(StoreTypeEnum)
  type: StoreTypeEnum;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => CreateUserDto)
  coordinatorDetails: CreateUserDto;
}
