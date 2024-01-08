import { CreateUserDto } from 'src/user/dto/create-user.dto';
export const BCRYPT_HASH_ROUND = 5;
export enum UserRolesEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AGENT = 'AGENT',
  STORE_MANAGER = 'STORE_MANAGER',
  BRM_MANAGER = 'BRM_MANAGER',
  STORE_LOCATION_MANAGER = 'STORE_LOCATION_MANAGER',
}

export enum StoreTypeEnum {
  STORE = 'STORE',
  BRM = 'BRM',
}

export enum TokenStatusEnum {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  CLOSED = 'CLOSED',
}

export const superAdminDetails: CreateUserDto = {
  email: 'johnsonolaolu@gmail.com',
  firstName: 'Super',
  lastName: 'Admin',
  password: 'Kastroud_19',
  phoneNo: '+2347053332295',
  //   role: UserRolesEnum.SUPER_ADMIN,
  userName: 'superAdmin',
};
