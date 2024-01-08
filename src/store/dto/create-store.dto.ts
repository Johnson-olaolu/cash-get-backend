import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
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

  @IsString()
  @IsNotEmpty()
  briefInfo: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsEnum(StoreTypeEnum)
  type: StoreTypeEnum;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => CreateUserDto)
  coordinatorDetails: CreateUserDto;
}
