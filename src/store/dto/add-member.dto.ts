import { IsEmail, IsEnum } from 'class-validator';
import { UserRolesEnum } from 'src/utils/constants';

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRolesEnum)
  use: UserRolesEnum;
}
