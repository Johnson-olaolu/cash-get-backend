import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateStoreDto } from 'src/store/dto/create-store.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class RegisterStoreDto extends CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  registrationToken: string;
}

export class RegisterAgentDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  registrationToken: string;
}

export class RegisterStoreAdminDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  registrationToken: string;
}
